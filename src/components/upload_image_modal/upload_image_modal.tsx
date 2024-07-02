import Modal from '@/components/modal/modal';
import Dnd from '@/components/dnd/dnd';
import Button from '@/components/button/button'
import { useState } from 'react';
import { ImageListProps } from '@/components/image_list/image_list';
import ImageList from '@/components/image_list/image_list';

type UploadImageModalProps = {
    allowMutiple: boolean,
    imageList: ImageListProps,
    uploadFiles: (files: File[]) => Promise<void>
}

export default function UploadImageModal({
    allowMutiple,
    imageList,
    uploadFiles
}: UploadImageModalProps) {
    const [isOpen, setIsOpen] = useState(true);
    const footer = (<div className='flex justify-between gap-4'>
        <Button theme='secondary' className="text-sm px-0 py-0 w-full">Cancel</Button>
        <Button theme='primary' className="text-sm px-0 py-0 w-full">Select Image</Button>
    </div>);
    const content = (<>
        <Dnd multiple={allowMutiple} uploadFiles={uploadFiles} />
        <ImageList imageItems={imageList} />
    </>);

    return <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        container={document.body}
        title='Upload image(s)'
        subtitle='You may upload up to 5 images'
        className='min-w-[600px] max-w-[700px] m-auto mt-[200px]'
        footer={footer}
        content={content}>
    </Modal>
}