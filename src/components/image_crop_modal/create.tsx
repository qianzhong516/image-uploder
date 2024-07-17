import axios from '@/axios';
import ImageCropModal from './image_crop_modal';
import CropperTypes from 'cropperjs';

type CreateImageCropModalProps = {
    imageTitle: string,
    imageSrc: string,
    isOpen: boolean,
    closeModal: () => void
}

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';

export const createImageCropModal = (): React.FC<CreateImageCropModalProps> => {
    const Component = ({
        imageTitle,
        imageSrc,
        isOpen,
        closeModal
    }: CreateImageCropModalProps) => {
        const onCrop = async (props: CropperTypes.CropBoxData, cropRatio: number) => {
            try {
                await axios.put(`api/profile-icons/${imageTitle}`, {
                    uploadedBy: CURRENT_USER_ID,
                    cropData: props,
                    cropRatio
                });
                // TODO: toast the success message
            } catch (err) {
                console.log(err)
            } finally {
                closeModal();
            }
        }

        return <ImageCropModal
            open={isOpen}
            imageSrc={imageSrc}
            onClose={closeModal}
            onCrop={onCrop} />
    }

    return Component;
}