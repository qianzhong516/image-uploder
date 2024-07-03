import Modal from '@/components/modal/modal';
import Dnd from '@/components/dnd/dnd';
import Button from '@/components/button/button'
import { useState } from 'react';
import { ImageListProps } from '@/components/image_list/image_list';
import ImageList from '@/components/image_list/image_list';

type UploadImageModalProps = {
    open: boolean,
    allowMutiple: boolean,
    imageList: ImageListProps,
    imageLimit: number, // max images that can be uploaded
    uploadFiles: (files: File[]) => Promise<void>,
    onClose: () => void,
}

export default function UploadImageModal({
    open,
    allowMutiple,
    imageList,
    imageLimit,
    uploadFiles,
    onClose,
}: UploadImageModalProps) {
    const footer = (<div className='flex justify-between gap-4'>
        <Button theme='secondary' className="text-sm px-0 py-0 w-full">Cancel</Button>
        <Button theme='primary' className="text-sm px-0 py-0 w-full">Select Image</Button>
    </div>);
    const content = (<>
        <Dnd multiple={allowMutiple} uploadFiles={uploadFiles} reachedLimit={imageList.length >= imageLimit} />
        <ImageList imageItems={imageList} />
    </>);

    return <Modal
        open={open}
        onClose={onClose}
        container={document.body}
        title='Upload image(s)'
        subtitle='You may upload up to 5 images'
        className='min-w-[600px] max-w-[700px] m-auto mt-[200px]'
        footer={footer}
        content={content}>
    </Modal>
}