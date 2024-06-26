import clsx from 'clsx';
import Image from 'next/image';

type ProfileIconProps = {
    state: 'initial' | 'uploading' | 'uploaded';
    size: number;
    src?: string;
    className?: string;
}

export default function ProfileIcon({ state, size, src, className }: ProfileIconProps) {
    return <div style={{ width: size, height: size }} className={clsx('relative rounded-full overflow-hidden', state === 'uploading' && 'after:content-[""] after:absolute after:w-full after:h-full after:inset-0 after:bg-black/30', className)}>
        <Image src={src && state !== 'initial' ? src : '/avatar.png'} width={size} height={size} alt='' className='object-cover' />
    </div>
}