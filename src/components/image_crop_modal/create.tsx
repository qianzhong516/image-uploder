import axios from '@/axios';
import ImageCropModal from './image_crop_modal';
import CropperTypes from 'cropperjs';
import { ImageItemCompleteProps } from '../image_list/image_item';
import { ProfileIcons } from '@/models/ProfileIcon';
import { getImageSource, getTotalSize } from '@/utils';

type CreateImageCropModalProps = {
    imgId: string,
    imgSrc: string,
    isOpen: boolean,
    updatePrimaryIcon?: (icon: ProfileIcons) => void,
    updateImage: (updatedIcon: Pick<ImageItemCompleteProps, 'totalSize' | 'imgSrc'>) => void,
    closeModal: () => void
}

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';

export const createImageCropModal = (): React.FC<CreateImageCropModalProps> => {
    const Component = ({
        imgId,
        imgSrc,
        isOpen,
        updatePrimaryIcon,
        updateImage,
        closeModal
    }: CreateImageCropModalProps) => {
        const onCrop = async (props: CropperTypes.CropBoxData, cropRatio: number) => {
            try {
                const res = await axios.put(`api/profile-icons/${imgId}`, {
                    uploadedBy: CURRENT_USER_ID,
                    cropData: props,
                    cropRatio
                });
                const { profileIcon } = res.data.message;
                const { totalSize, path }: { totalSize: number, path: string } = profileIcon
                updateImage({
                    totalSize: getTotalSize(totalSize),
                    imgSrc: path,
                });
                // @ts-ignore 
                updatePrimaryIcon?.(prev => ({ ...prev, path }));
                // TODO: toast the success message
            } catch (err) {
                console.log(err)
            } finally {
                closeModal();
            }
        }

        let src = imgSrc;
        const isDataURL = (url: string) => /^data:image\/(jpeg|jpg|png);base64,/.test(url);
        if (!isDataURL(imgSrc)) {
            src = getImageSource(src);
        }

        return <ImageCropModal
            open={isOpen}
            imgSrc={src}
            onClose={closeModal}
            onCrop={onCrop} />
    }

    return Component;
}