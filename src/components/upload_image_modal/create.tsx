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
    currentProfileIcon?: ProfileIcons,
    updatePrimaryIcon: (icon: ProfileIcons) => void,
    closeModal: () => void
}

export const createUploadImageModal = (): React.FC<CreateUploadImageModalProps> => {
    const ImageCropModal = createImageCropModal();

    const Component = ({ isOpen, currentProfileIcon, updatePrimaryIcon, closeModal }: CreateUploadImageModalProps) => {
        const [imageList, setImageList] = useImmer<ImageListProps>([]);
        const [hasFetchError, setHasFetchError] = useState(false);
        const [selectedIconId, setSelectedIconId] = useState('');
        const [isCropperOpen, setIsCropperOpen] = useState(false);
        const [cropperImgId, setCropperImgId] = useState('');

        const handleOnConfirm = useCallback(async () => {
            closeModal();
            const res = await axios.put(`api/user/${CURRENT_USER_ID}`, {
                iconId: selectedIconId
            });
            const { icon }: { icon: ProfileIcons } = res.data.message;
            if (icon) {
                updatePrimaryIcon(icon);
            }
        }, [closeModal, selectedIconId, updatePrimaryIcon]);

        const createDeleteImageHandler = useCallback((id: string) => async () => {
            setImageList(draft => draft.filter(d => (d.state === 'complete' || d.state === 'load-success') && d.id !== id));
            await axios.delete(`api/profile-icons/${id}`).catch(err => {
                // TODO: show the error in a toast
                console.log(err);
            });
        }, [setImageList]);

        const createCancelUploadHandler = useCallback((fileName: string, controller: AbortController) => () => {
            setImageList(draft => draft.filter(d => d.title !== fileName));
            controller.abort('Cancel upload.');
        }, [setImageList]);

        const openCropper = useCallback((id: string) => {
            setIsCropperOpen(true);
            setCropperImgId(id);
        }, []);
        const closeCropper = useCallback(() => setIsCropperOpen(false), []);

        const handleUploadImage = async (files: File[]) => {

            // read image baseUrls in parallel
            const sources = await getImgSrc(files);

            files.forEach((file, index) => {
                const i = imageList.length + index;
                const title = files[index].name;
                const imgSrc = sources[index] as string;
                const totalSize = getTotalSize(file.size);

                const controller = new AbortController();
                setImageList(draft => {
                    draft[i] = {
                        state: 'loading',
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
                    const fileId = res.data.message.id;
                    setImageList(draft => {
                        draft[i] = {
                            state: 'load-success',
                            id: fileId,
                            title,
                            totalSize,
                            imgSrc,
                            onDelete: createDeleteImageHandler(fileId)
                        }
                    });
                    setTimeout(() => {
                        setImageList(draft => {
                            draft[i] = {
                                state: 'complete',
                                id: fileId,
                                title,
                                totalSize,
                                imgSrc,
                                selected: false,
                                onChangeSelection: (e) => setSelectedIconId(e.target.value),
                                openCropper,
                                onDelete: createDeleteImageHandler(fileId)
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

                            if (err.status === 413) {
                                // the payload exceeds the server's limit
                                error = 'This image is larger than 5MB. Please select a smaller image.';
                            }

                            draft[i] = {
                                state: 'error',
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
                    let selectedIconId = '';
                    setImageList(icons.map(({ _id, title, totalSizeInBytes, path }: ProfileIcons) => {
                        const defaultSelected = currentProfileIcon?.path === path;
                        if (defaultSelected) {
                            selectedIconId = _id;
                        }
                        return {
                            state: 'complete',
                            id: _id,
                            title,
                            totalSize: getTotalSize(totalSizeInBytes),
                            imgSrc: path,
                            onChangeSelection: (e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedIconId(e.target.value),
                            selected: defaultSelected,
                            openCropper,
                            onDelete: createDeleteImageHandler(_id),
                        } as ImageItemCompleteProps
                    }));
                    setSelectedIconId(selectedIconId);
                } catch (_) {
                    setHasFetchError(true);
                }
            }

            if (isOpen) {
                displayUploadedIcons();
            }
        }, [createDeleteImageHandler, isOpen, currentProfileIcon?.path, openCropper, setImageList]);

        const index = imageList.findIndex(img => img.state === 'complete' && img.id === cropperImgId);
        const cropperImage = imageList[index];
        const handleUpdateImage = useCallback((updatedImage: Pick<ImageItemCompleteProps, 'totalSize' | 'imgSrc'>) => {
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
                        isOpen={isCropperOpen}
                        imgId={cropperImgId}
                        imgSrc={cropperImage.imgSrc}
                        updatePrimaryIcon={cropperImage.id === currentProfileIcon?._id ? updatePrimaryIcon : undefined}
                        updateImage={handleUpdateImage}
                        closeModal={closeCropper} />}
            </>
        )
    }

    return Component;
}
