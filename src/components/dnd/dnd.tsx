import UploadCloudIcon from '@/components/icons/upload-cloud';
import { DragEvent } from 'react';

type DndProps = {
    multiple: boolean,
    uploadFiles: (files: File[]) => Promise<void>,
}

export default function Dnd({
    multiple,
    uploadFiles
}: DndProps) {
    const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (e.dataTransfer.items) {
            Array.from(e.dataTransfer.items).forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    console.log(`file[${i}].name = ${file?.name}`);
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            Array.from(e.dataTransfer.files).forEach((file, i) => {
                console.log(`file[${i}].name = ${file.name}`);
            });
        }
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center p-4 bg-neutral-50 border-2 border-neutral-200 rounded" onDragOver={handleOnDragOver} onDrop={handleOnDrop}>
            <div>
                <label htmlFor="profile-icon-uploader" className='block text-indigo-500 rounded-full p-2 cursor-pointer shadow focus-within:outline focus-within:outline-2'>
                    <input type="file" name="profile-icon" id="profile-icon-uploader" className='visuallyhidden' multiple={multiple} />
                    <UploadCloudIcon size={25} />
                </label>
            </div>

            <div className='text-center'>
                <h2 className="text-md font-semibold">Click or drag and drop to upload</h2>
                <p className="text-neutral-600 text-sm">PNG, or JPG (Max 5MB)</p>
            </div>
        </div>
    )
}