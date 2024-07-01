import Modal from '@/components/modal/modal';
import Dnd from '@/components/dnd/dnd';
import Button from '@/components/button/button'
import { useState } from 'react';

type UploadImageModalProps = {
    allowMutiple: boolean,
    imageList: React.ReactNode,
    uploadFiles: () => Promise<void>
}

export default function UploadImageModal({
    allowMutiple,
    imageList,
    uploadFiles
}: UploadImageModalProps) {
    const [isOpen, setIsOpen] = useState(true);

    return <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        container={document.body}
        title='Upload image(s)'
        subtitle='You may upload up to 5 images'
        className='min-w-[600px] max-w-[700px] m-auto mt-[200px]'
        leftButton={({ className }: { className: string }) => <Button theme='secondary' className={className}>Cancel</Button>}
        rightButton={({ className }: { className: string }) => <Button theme='primary' className={className} >Select Image</Button>}>
        <Dnd multiple={allowMutiple} uploadFiles={uploadFiles} />
        {imageList}
    </Modal>
}