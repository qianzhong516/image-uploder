import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

type ProfileIconProps = {
    size: number;
    src?: string;
    isEmpty?: boolean,
    isUploading?: boolean,
    className?: string;
}

export default function ProfileIcon({ size, src, isEmpty = false, isUploading = false, className }: ProfileIconProps) {
    return <div style={{ width: size, height: size }} className={twMerge('relative rounded-full overflow-hidden', isUploading && 'after:content-[""] after:absolute after:w-full after:h-full after:inset-0 after:bg-black/30', className)}>
        <Image src={src && !isEmpty ? src : '/avatar.png'} width={size} height={size} alt='' className='object-cover' />
    </div>
}