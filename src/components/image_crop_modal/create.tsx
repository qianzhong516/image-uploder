import axios from '@/axios';
import ImageCropModal from './image_crop_modal';
import CropperTypes from 'cropperjs';
import { ImageItemCompleteProps } from '../image_list/image_item';
import { ProfileIcons } from '@/models/ProfileIcon';
import { getImageSource, getTotalSize } from '@/utils';

type CreateImageCropModalProps = {
    imageTitle: string,
    imageSrc: string,
    isOpen: boolean,
    updatePrimaryIcon: (icon: string) => void,
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
        updatePrimaryIcon,
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
                isPrimaryIconUpdated && updatePrimaryIcon(path);
                // TODO: toast the success message
            } catch (err) {
                console.log(err)
            } finally {
                closeModal();
            }
        }

        let src = imageSrc;
        const isDataURL = (url: string) => /^data:image\/(jpeg|jpg|png);base64,/.test(url);
        if (!isDataURL(imageSrc)) {
            src = getImageSource(src);
        }

        return <ImageCropModal
            open={isOpen}
            imageSrc={src}
            onClose={closeModal}
            onCrop={onCrop} />
    }

    return Component;
}