import UploadImageModal from './upload_image_modal';
import { getImgSrc, getTotalSize } from '@/utils';
import { ImageListProps } from '@/components/image_list/image_list';
import { useImmer } from "use-immer";
import { ProfileIcons } from '@/models/ProfileIcon';
import { AxiosError, AxiosProgressEvent } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/axios';
import { createImageCropModal } from '@/components/image_crop_modal/create';
import { ImageItemCompleteProps } from '../image_list/image_item';

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';
const IMAGE_UPLOAD_LIMIT = 5;

type CreateUploadImageModalProps = {
    isOpen: boolean,
    updateProfileIcon: (icon: string) => void,
    closeModal: () => void
}

export const createUploadImageModal = (): React.FC<CreateUploadImageModalProps> => {
    const ImageCropModal = createImageCropModal();

    const Component = ({ isOpen, updateProfileIcon, closeModal }: CreateUploadImageModalProps) => {
        const [imageList, setImageList] = useImmer<ImageListProps>([]);
        const [hasFetchError, setHasFetchError] = useState(false);
        const [selectedOption, setSelectedOption] = useState('');
        const [isCropperOpen, setIsCropperOpen] = useState(false);
        const [cropperImgTitle, setCropperImgTitle] = useState('');

        const handleOnConfirm = useCallback(async () => {
            closeModal();
            const res = await axios.put(`api/user/${CURRENT_USER_ID}`, {
                data: {
                    profileIconTitle: selectedOption
                }
            });
            const profileIcon = res.data.message.profileIcon;
            if (profileIcon) {
                updateProfileIcon(profileIcon);
            }
        }, [closeModal, selectedOption, updateProfileIcon]);

        const createDeleteImageHandler = useCallback((fileName: string) => async () => {
            setImageList(draft => draft.filter(d => d.title !== fileName));
            await axios.delete(`api/profile-icons/${fileName}`, {
                data: {
                    uploadedBy: CURRENT_USER_ID
                }
            }).catch(err => {
                // TODO: show the error in a toast
                console.log(err);
            });
        }, [setImageList]);

        const createCancelUploadHandler = useCallback((fileName: string, controller: AbortController) => () => {
            setImageList(draft => draft.filter(d => d.title !== fileName));
            controller.abort('Cancel upload.');
        }, [setImageList]);

        const openCropper = useCallback((title: string) => {
            setIsCropperOpen(true);
            setCropperImgTitle(title);
        }, []);
        const closeCropper = useCallback(() => setIsCropperOpen(false), []);

        const handleUploadImage = async (files: File[]) => {

            // read image baseUrls in parallel
            const sources = await getImgSrc(files);

            files.forEach((file, index) => {
                const i = imageList.length + index;
                const title = files[index].name; // TODO: deal with duplicate file name
                const imgSrc = sources[index] as string;
                const totalSize = getTotalSize(file.size);

                const controller = new AbortController();
                setImageList(draft => {
                    draft[i] = {
                        state: 'loading',
                        id: title,
                        title,
                        imgSrc,
                        totalSize,
                        progress: 0,
                        onCancelUpload: createCancelUploadHandler(title, controller)
                    }
                });

                const formData = new FormData();
                formData.append('file', file);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        const { loaded, total } = progressEvent;
                        if (!total) { return }
                        // use setState callback here to avoid stale state
                        setImageList(draft => {
                            if (draft[i].state === 'loading') {
                                draft[i].progress = Math.round(loaded / total * 100);
                            }
                        });
                    },
                    signal: controller.signal
                }

                axios.post('/api/upload', formData, config).then(res => {
                    setImageList(draft => {
                        const item = draft[i]
                        draft[i] = {
                            state: 'load-success',
                            id: title, // use titles as id
                            title,
                            totalSize,
                            imgSrc,
                            onDelete: createDeleteImageHandler(item.title)
                        }
                    });

                    setTimeout(() => {
                        setImageList(draft => {
                            const item = draft[i];
                            draft[i] = {
                                state: 'complete',
                                id: title,
                                title,
                                totalSize,
                                imgSrc,
                                onChangeSelection: (e) => setSelectedOption(e.target.value),
                                openCropper,
                                onDelete: createDeleteImageHandler(item.title)
                            };
                        })
                    }, 2000);
                }).catch(err => {
                    console.log(err)

                    if (err instanceof AxiosError) {
                        setImageList(draft => {
                            let error = err.response?.data.message;

                            if (err.code === AxiosError.ERR_CANCELED) {
                                error = 'The uploading process has been cancelled';
                            }

                            if (err.code === AxiosError.ERR_NETWORK) {
                                error = 'An error occurred during the upload. Please check your network connection and try again.';
                            }

                            draft[i] = {
                                state: 'error',
                                id: title,
                                title,
                                totalSize,
                                onDelete: () => setImageList(draft => draft.filter(d => d.title !== title)),
                                error
                            }
                        })
                    }
                });
            });
        };

        useEffect(() => {
            async function displayUploadedIcons() {
                try {
                    const res = await axios.get('/api/profile-icons', {
                        params: {
                            userId: CURRENT_USER_ID
                        }
                    });
                    const icons = res.data.message || [];
                    setImageList(icons.map(({ title, totalSizeInBytes, path }: ProfileIcons, i: number) => ({
                        state: 'complete',
                        id: title,
                        title,
                        totalSize: getTotalSize(totalSizeInBytes),
                        imgSrc: path,
                        onChangeSelection: (e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedOption(e.target.value),
                        openCropper,
                        onDelete: createDeleteImageHandler(title),
                    })));
                } catch (_) {
                    setHasFetchError(true);
                }
            }

            if (isOpen) {
                displayUploadedIcons();
            }
        }, [createDeleteImageHandler, isOpen, openCropper, setImageList]);

        const index = imageList.findIndex(img => img.title === cropperImgTitle);
        const cropperImage = imageList[index];
        const handleUpdateImage = useCallback((updatedImage: Pick<ImageItemCompleteProps, 'title' | 'totalSize' | 'imgSrc'>) => {
            setImageList(draft => {
                draft[index] = {
                    ...draft[index],
                    ...updatedImage
                }
            });
        }, [index, setImageList]);

        return (
            <>
                <UploadImageModal
                    open={isOpen}
                    allowMutiple={true}
                    imageList={Array.from(imageList.values())}
                    error={imageList.length >= IMAGE_UPLOAD_LIMIT ? 'reachedLimit' : hasFetchError ? 'dataFetch' : undefined}
                    uploadFiles={handleUploadImage}
                    onClose={closeModal}
                    onConfirm={handleOnConfirm}
                />
                {cropperImage && cropperImage.state === 'complete' &&
                    <ImageCropModal
                        updateImage={handleUpdateImage}
                        imageTitle={cropperImgTitle}
                        imageSrc={cropperImage.imgSrc}
                        isOpen={isCropperOpen}
                        closeModal={closeCropper} />}
            </>
        )
    }

    return Component;
}
