import UploadCloudIcon from '@/components/icons/upload-cloud';

export default function Dnd() {
    return (
        <form className="flex flex-col gap-4 justify-center items-center p-4 bg-neutral-50 border-2 border-neutral-200 rounded">
            <div>
                <label htmlFor="profile-icon-uploader" className='block text-indigo-500 rounded-full p-2 cursor-pointer shadow focus-within:outline focus-within:outline-2'>
                    <input type="file" name="profile-icon" id="profile-icon-uploader" className='visuallyhidden' />
                    <UploadCloudIcon size={25} />
                </label>
            </div>

            <div className='text-center'>
                <h2 className="text-md font-semibold">Click or drag and drop to upload</h2>
                <p className="text-neutral-600 text-sm">PNG, or JPG (Max 5MB)</p>
            </div>
        </form>
    )
}