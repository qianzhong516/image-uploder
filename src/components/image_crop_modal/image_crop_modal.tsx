import Modal from '@/components/modal/modal';
import Image from 'next/image';
import Button from '@/components/button/button'

type ImageCropModalProps = {
    open: boolean,
    imageSrc: string,
    onClose: () => void,
    onCrop: () => void
}

export default function ImageCropModal({
    open,
    imageSrc,
    onClose,
    onCrop
}: ImageCropModalProps) {
    const content = (
        <div className='bg-black w-full h-full'>
            <Image src={imageSrc} width={200} height={150} alt='' objectFit='contain' objectPosition='center' className='m-auto' />
        </div>
    )
    const footer = (<div className='flex justify-between gap-4'>
        <Button theme='secondary' className="text-sm px-0 py-0 w-full" onClick={onClose}>Cancel</Button>
        <Button theme='primary' className="text-sm px-0 py-0 w-full" onClick={onCrop}>Confirm</Button>
    </div>);

    return (
        <Modal
            ID='imageCrop'
            className='min-w-[250px] max-w-[300px] m-auto mt-[200px]'
            open={open}
            title='Crop your picture'
            content={content}
            container={document.body}
            footer={footer}
            onClose={onClose} />
    );
}