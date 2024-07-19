import axios from '@/axios';
import ImageCropModal from './image_crop_modal';
import CropperTypes from 'cropperjs';
import { ImageItemCompleteProps } from '../image_list/image_item';
import { ProfileIcons } from '@/models/ProfileIcon';
import { getTotalSize } from '@/utils';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';

type CreateImageCropModalProps = {
    imageTitle: string,
    imageSrc: string,
    isOpen: boolean,
    updateProfileIcon: (icon: string) => void,
    updateImage: (updatedIcon: Pick<ImageItemCompleteProps, 'title' | 'totalSize' | 'imgSrc'>) => void,
    closeModal: () => void
}

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';

export const createImageCropModal = (): React.FC<CreateImageCropModalProps> => {
    const Component = ({
        imageTitle,
        imageSrc,
        isOpen,
        updateProfileIcon,
        updateImage,
        closeModal
    }: CreateImageCropModalProps) => {
        const onCrop = async (props: CropperTypes.CropBoxData, cropRatio: number) => {
            try {
                const res = await axios.put(`api/profile-icons/${imageTitle}`, {
                    uploadedBy: CURRENT_USER_ID,
                    cropData: props,
                    cropRatio
                });
                const { profileIcon, isPrimaryIconUpdated } = res.data.message;
                const { path, title, totalSizeInBytes }: ProfileIcons = profileIcon
                updateImage({
                    title: title,
                    totalSize: getTotalSize(totalSizeInBytes),
                    imgSrc: path,
                });
                isPrimaryIconUpdated && updateProfileIcon(path);
                // TODO: toast the success message
            } catch (err) {
                console.log(err)
            } finally {
                closeModal();
            }
        }

        // generates the url manually here because we aren't using the next/image component in cropperjs,
        // next/image generates the url for images automatically. It goes through a loader,
        // @see: https://nextjs.org/docs/pages/building-your-application/optimizing/images#loaders.
        let src = imageSrc;
        const isDataURL = (url: string) => /^data:image\/(jpeg|jpg|png);base64,/.test(url);
        if (!isDataURL(imageSrc)) {
            // mimic next/image's url pattern. 
            // @see: https://github.com/vercel/next.js/blob/0c3b063d09dc7ddcf9e308f2d2848f4c558c748b/packages/next/src/shared/lib/image-loader.ts#L60-L67.
            const configPath = imageConfigDefault.path;
            // w has to satisfy imageConfigDefault.imageSizes
            src = `${configPath}?url=${encodeURIComponent(imageSrc)}&w=${96}&q=${75}`;
        }

        return <ImageCropModal
            open={isOpen}
            imageSrc={src}
            onClose={closeModal}
            onCrop={onCrop} />
    }

    return Component;
}