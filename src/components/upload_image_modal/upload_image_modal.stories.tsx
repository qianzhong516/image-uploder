import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import UploadImageModal from './upload_image_modal';
import { fn } from '@storybook/test';
import { ImageListProps } from '../image_list/image_list';
import { uploadFileToServer } from './mock_upload_image';
import { getImgSrc, getTotalSize } from '@/utils';
import ModalContextProvider from '../modal/modalContext';

const meta = {
    title: 'UI/Modal/UploadImgModal',
    component: UploadImageModal,
    tags: ['!autodocs'],
    args: {
    },
    decorators: [
        storyFn => {
            return (<ModalContextProvider>{storyFn()}</ModalContextProvider>)
        }
    ]
} satisfies Meta<typeof UploadImageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        open: true,
        allowMutiple: true,
        imageList: [
            { id: '1', state: 'complete', title: 'Image1', totalSize: '200kb', imgSrc: '/avatar-image-item.png', onDelete: fn(), onCropImage: fn(), onChangeSelection: fn() },
        ],
        uploadFiles: fn(),
        onClose: fn(),
        onConfirm: fn(),
    },
    render: (args) => {
        const [_, updateArgs, resetArgs] = useArgs<{ imageList: ImageListProps }>();

        const uploadFiles = async (files: File[]) => {
            const sources = await getImgSrc(files);
            console.log({ sources })
            const imagesInUpload: ImageListProps = files.map((file, i) => {
                return {
                    id: file.name,
                    title: file.name,
                    imgSrc: sources[i] as string,
                    totalSize: getTotalSize(file.size),
                    state: 'loading',
                    progress: 0,
                    onCancelUpload: fn()
                }
            });
            const updatedList = [...args.imageList, ...imagesInUpload];
            updateArgs({ imageList: updatedList });
            const job = uploadFileToServer(files);

            job.on('uploading', (progress) => {
                [...progress.keys()].forEach(fileName => {
                    const item = updatedList.find(item => fileName === item.title);
                    if (item && item.state === 'loading') {
                        const fileProgress = progress.get(fileName);
                        item.progress = Math.round(fileProgress.loaded / fileProgress.totalSize * 100);
                    }
                })
                console.log(updatedList)
                updateArgs({ imageList: updatedList });
            });

            job.on('complete', (fileName) => {
                const index = updatedList.findIndex(file => file.title === fileName);
                const item = updatedList[index];
                if (item.state === 'loading') {
                    updatedList.splice(index, 1, {
                        state: 'load-success',
                        id: item.title,
                        title: item.title,
                        totalSize: item.totalSize,
                        imgSrc: item.imgSrc,
                        onDelete: fn()
                    });
                    updateArgs({ imageList: updatedList });
                    setTimeout(() => {
                        updatedList.splice(index, 1, {
                            state: 'complete',
                            id: item.title,
                            title: item.title,
                            totalSize: item.totalSize,
                            imgSrc: item.imgSrc,
                            onCropImage: fn(),
                            onDelete: fn(),
                            onChangeSelection: fn()
                        });
                        updateArgs({ imageList: updatedList });
                    }, 2000);
                }
            });

            job.on('error', (errors) => {
                errors.forEach(({ fileName, error }: { fileName: string, error: string }) => {
                    const index = updatedList.findIndex(file => file.title === fileName);
                    const item = updatedList[index];
                    updatedList.splice(index, 1, {
                        state: 'error',
                        id: item.title,
                        title: item.title,
                        totalSize: item.totalSize,
                        error,
                        onDelete: fn()
                    });
                });
                updateArgs({ imageList: updatedList });
            });
        }

        return <div>
            <UploadImageModal {...args} uploadFiles={uploadFiles} />
        </div>;
    }
}
