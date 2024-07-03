import UploadCloudIcon from '@/components/icons/upload-cloud';
import { ChangeEvent, DragEvent, useRef } from 'react';

type DndProps = {
    multiple: boolean,
    reachedLimit: boolean,
    uploadFiles: (files: File[]) => Promise<void>,
}

export default function Dnd({
    multiple,
    reachedLimit,
    uploadFiles
}: DndProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        ref.current!.style.borderColor = '#4f46e5';
    }

    const handleOnDragLeave = () => {
        ref.current!.style.borderColor = '';
    }

    const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files: File[] = [];

        ref.current!.style.borderColor = '';

        if (e.dataTransfer.items) {
            Array.from(e.dataTransfer.items).forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    file && files.push(file);
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            Array.from(e.dataTransfer.files).forEach((file, i) => {
                files.push(file);
            });
        }

        uploadFiles(files);
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        const files = e.target.files ? Array.from(e.target.files) : [];
        uploadFiles(files);
    }

    return reachedLimit ? (
        <div className="flex flex-col gap justify-center items-center p-4 bg-neutral-50 border-2 border-neutral-200 rounded">
            <h2 className='text-md text-red-600 font-semibold'>You have reached the image limit</h2>
            <p className='text-xs text-neutral-600'>Remove one or more to upload more images.</p>
        </div>
    ) : (
        <div className="flex flex-col gap-4 justify-center items-center p-4 bg-neutral-50 border-2 border-neutral-200 rounded" onDragOver={handleOnDragOver} onDrop={handleOnDrop} ref={ref} onDragLeave={handleOnDragLeave}>
            <div>
                <label htmlFor="profile-icon-uploader" className='block text-indigo-500 rounded-full p-2 cursor-pointer shadow focus-within:outline focus-within:outline-2'>
                    <input type="file" name="profile-icon" id="profile-icon-uploader" className='visuallyhidden' multiple={multiple} onChange={handleOnChange} />
                    <UploadCloudIcon size={30} />
                </label>
            </div>

            <div className='text-center'>
                <h2 className="text-md font-semibold">Click or drag and drop to upload</h2>
                <p className="text-neutral-600 text-sm">PNG, or JPG (Max 5MB)</p>
            </div>
        </div>
    )
}