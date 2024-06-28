import ProfileIcon from '@/components/profile_icon/profile_icon';
import Button from '../button/button';
import CloseIcon from '../icons/close';
import RadioButton from '@/components/radio_button/radio_button';
import CropIcon from '@/components/icons/crop';
import DeleteBinIcon from '@/components/icons/delete-bin';

type ImageItemCommonProps = {
    title: string,
    totalSize: string,
    imgSrc: string,
    className?: string,
}

type ImageItemWrapperProps = ImageItemCommonProps & {
    rightControl: React.ReactNode,
    bottomControl: React.ReactNode
}

type ImageItemProps = ImageItemCommonProps & ({
    state: 'initial',
    onCropImage: () => void,
    onDelete: () => void
} | {
    state: 'loading',
    progress: number,
    onCancelUpload: () => void
});

const ImageItemWrapper = ({
    title,
    totalSize,
    imgSrc,
    rightControl,
    bottomControl,
}: ImageItemWrapperProps) => {
    return (
        <div className="flex justify-between w-full">
            <div className='flex gap-4'>
                <ProfileIcon src={imgSrc} size={80} className='rounded-md' />
                <div className='flex flex-col justify-between'>
                    <div className='flex justify-between items-start'>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-base fonts-semibold">{title}</h2>
                            <p className="text-xs text-neutral-600">{totalSize}</p>
                        </div>
                    </div>
                    {bottomControl}
                </div>
            </div>
            {rightControl}
        </div>
    );
}

export default function ImageItem({
    title,
    totalSize,
    imgSrc,
    className,
    ...props
}: ImageItemProps) {

    switch (props.state) {
        case 'initial': {
            const rightControl = <RadioButton name='image-item' value={title} />;
            const bottomControl = <div className='flex gap-1 items-center'>
                <Button theme='tertiary' prefixIcon={<CropIcon />} className='text-sm' onClick={props.onCropImage}>Crop image</Button> <span className='text-neutral-600 font-bold'>&sdot;</span>
                <Button theme='tertiary' prefixIcon={<DeleteBinIcon />} className='text-sm' onClick={props.onDelete}>Delete</Button>
            </div>

            return <ImageItemWrapper
                className={className}
                title={title}
                totalSize={totalSize}
                imgSrc={imgSrc}
                rightControl={rightControl}
                bottomControl={bottomControl} />;

        } case 'loading': {
            const rightControl = <Button theme='tertiary' onClick={props.onCancelUpload} className='items-start'><CloseIcon /></Button>
            const bottomControl = undefined;

            return <ImageItemWrapper
                className={className}
                title={title}
                totalSize={totalSize}
                imgSrc={imgSrc}
                rightControl={rightControl}
                bottomControl={bottomControl} />;
        }
    }
}