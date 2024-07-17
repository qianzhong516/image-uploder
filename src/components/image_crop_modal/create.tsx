import axios from '@/axios';
import ImageCropModal from './image_crop_modal';

type CreateImageCropModalProps = {
    imageSrc: string,
    isOpen: boolean,
    closeModal: () => void
}

export const createImageCropModal = (): React.FC<CreateImageCropModalProps> => {
    const Component = ({
        imageSrc,
        isOpen,
        closeModal
    }: CreateImageCropModalProps) => {
        const onCrop = async () => {
            // await axios
        }
        return <ImageCropModal
            open={isOpen}
            imageSrc={imageSrc}
            onClose={closeModal}
            onCrop={onCrop} />
    }

    return Component;
}