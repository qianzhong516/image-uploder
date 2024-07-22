import Modal from '@/components/modal/modal';
import Dnd from '@/components/dnd/dnd';
import Button from '@/components/button/button'
import { ImageListProps } from '@/components/image_list/image_list';
import ImageList from '@/components/image_list/image_list';
import EmotionSadLineIcon from '@/components/icons/emotion-sad-line';

type UploadImageModalProps = {
    open: boolean,
    allowMutiple: boolean,
    imageList: ImageListProps,
    error?: 'dataFetch' | 'reachedLimit',
    uploadFiles: (files: File[]) => Promise<void>,
    onClose: () => void,
    onConfirm: () => void,
}

export default function UploadImageModal({
    open,
    allowMutiple,
    imageList,
    error,
    uploadFiles,
    onClose,
    onConfirm
}: UploadImageModalProps) {
    const footer = (<div className='flex justify-between gap-4'>
        <Button theme='secondary' className="text-sm px-0 py-0 w-full" onClick={onClose}>Cancel</Button>
        <Button theme='primary' className="text-sm px-0 py-0 w-full" onClick={onConfirm}>Select Image</Button>
    </div>);
    const reachedLimitError = <div className="flex flex-col gap justify-center items-center p-4 bg-neutral-50 border-2 border-neutral-200 rounded">
        <h2 className='text-md text-red-600 font-semibold'>You have reached the image limit</h2>
        <p className='text-xs text-neutral-600'>Remove one or more to upload more images.</p>
    </div>
    const dataFetchError = <div className='flex flex-col gap-2 items-center w-2/5 m-auto text-center'>
        <div className='text-indigo-500 rounded-full p-2 shadow w-[45px]'>
            <EmotionSadLineIcon size={30} />
        </div>
        <div>
            <h2 className='text-lg font-semibold'>Unexpected error</h2>
            <p className='text-md'>We are facing some issues at the moment. Please try again later or contact support.</p>
        </div>
    </div>

    let content;
    if (error == null) {
        content = (
            <>
                <Dnd multiple={allowMutiple} uploadFiles={uploadFiles} />
                <ImageList imageItems={imageList} />
            </>
        );
    } else if (error === 'reachedLimit') {
        content = (
            <>
                {reachedLimitError}
                <ImageList imageItems={imageList} />
            </>
        );
    } else if (error === 'dataFetch') {
        content = (
            <>
                <Dnd multiple={allowMutiple} uploadFiles={uploadFiles} />
                {dataFetchError}
            </>
        );
    }

    return <Modal
        ID='uploadImage'
        open={open}
        onClose={onClose}
        title='Upload image(s)'
        subtitle='You may upload up to 5 images'
        className='max-w-[600px] max-h-screen w-full m-auto sm:mt-[200px] overflow-y-auto'
        footer={footer}
        content={content}>
    </Modal>
}