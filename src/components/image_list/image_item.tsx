import ProfileIcon from '@/components/profile_icon/profile_icon';
import Button from '../button/button';
import CloseIcon from '../icons/close';
import RadioButton from '@/components/radio_button/radio_button';
import CropIcon from '@/components/icons/crop';
import DeleteBinIcon from '@/components/icons/delete-bin';
import CheckIcon from '@/components/icons/check';
import FileDamageIcon from '@/components/icons/file_damage';
import ProgressBar from '@/components/progress_bar/progress_bar';

type ImageItemCommonProps = {
    title: string,
    totalSize: string,
    className?: string,
}

type ImageItemWrapperProps = ImageItemCommonProps & {
    thumbnail: React.ReactNode,
    rightControl: React.ReactNode,
    bottomControl: React.ReactNode
}

export type ImageItemProps = ImageItemCommonProps & ({
    state: 'complete',
    imgSrc: string,
    onCropImage: () => void,
    onDelete: () => void
} | {
    state: 'load-success',
    imgSrc: string,
    onDelete: () => void,
} | {
    state: 'error',
    error: string,
    onDelete: () => void,
} | {
    state: 'loading',
    imgSrc: string,
    progress: number,
    onCancelUpload: () => void
});

const ImageItemWrapper = ({
    title,
    totalSize,
    thumbnail,
    rightControl,
    bottomControl,
}: ImageItemWrapperProps) => {
    return (
        <div className="relative flex gap-2 w-full">
            {thumbnail}
            <div className='flex flex-col justify-between gap-1 w-full'>
                <div className="flex flex-col gap">
                    <h2 className="text-base fonts-semibold">{title}</h2>
                    <p className="text-xs text-neutral-600">{totalSize}</p>
                </div>
                {bottomControl}
            </div>
            {rightControl}
        </div>
    );
}

export default function ImageItem({
    title,
    totalSize,
    className,
    ...props
}: ImageItemProps) {

    const CloseBtn = ({ onClick }: { onClick: () => void }) => <Button theme='tertiary' onClick={onClick} className='absolute top-0 right-0 min-w-fit min-h-fit'><CloseIcon /></Button>;
    const commonProps = { title, totalSize, className };

    switch (props.state) {
        case 'complete': {
            const thumbnail = <ProfileIcon src={props.imgSrc} size={80} className='rounded-md' />
            const rightControl = <RadioButton name='image-item' value={title} className='absolute top-0 right-1' />;
            const bottomControl = <div className='flex gap-1 items-center'>
                <Button theme='tertiary' prefixIcon={<CropIcon />} className='text-sm' onClick={props.onCropImage}>Crop image</Button> <span className='text-neutral-600 font-bold'>&sdot;</span>
                <Button theme='tertiary' prefixIcon={<DeleteBinIcon />} className='text-sm' onClick={props.onDelete}>Delete</Button>
            </div>

            return <ImageItemWrapper
                {...commonProps}
                thumbnail={thumbnail}
                rightControl={rightControl}
                bottomControl={bottomControl} />;

        }
        case 'load-success': {
            const thumbnail = <ProfileIcon src={props.imgSrc} size={80} className='rounded-md' />

            return <ImageItemWrapper
                {...commonProps}
                thumbnail={thumbnail}
                rightControl={<CloseBtn onClick={props.onDelete} />}
                bottomControl={<p className='flex gap-1 items-center text-green-700 text-xs'><CheckIcon /> Upload success!</p>} />;
        }
        case 'error': {
            const thumbnail = <div className='flex justify-center items-center w-[80px] h-[80px] border-2 border-neutral-200 bg-neutral-50 rounded-lg'>
                <FileDamageIcon size='md' />
            </div>

            return <ImageItemWrapper
                {...commonProps}
                thumbnail={thumbnail}
                rightControl={<CloseBtn onClick={props.onDelete} />}
                bottomControl={<p className='text-red-600 text-xs'>{props.error}</p>} />;
        }
        case 'loading': {
            const bottomControl = <ProgressBar value={props.progress} thickness={6} />;
            const thumbnail = <ProfileIcon src={props.imgSrc} size={80} className='rounded-md' />

            return <ImageItemWrapper
                {...commonProps}
                thumbnail={thumbnail}
                rightControl={<CloseBtn onClick={props.onCancelUpload} />}
                bottomControl={bottomControl} />;
        }
    }
}