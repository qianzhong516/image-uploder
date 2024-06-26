import ProfileIcon from '@/components/profile_icon/profile_icon';
import Button from '@/components/button/button';
import { twMerge } from 'tailwind-merge';

const NATION_FLAGS = {
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
}

type ProfileBannerProps = {
    profileIconSrc: string,
    name: string,
    handler: string,
    title: string,
    company: React.ReactNode,
    pronounce: 'She|Her' | 'He/Him' | 'They/Them',
    nation: keyof typeof NATION_FLAGS,
    city: string,
    className?: string,
    onUpdatePicture: () => void
}


export default function profileBanner({
    profileIconSrc,
    name,
    handler,
    title,
    company,
    pronounce,
    nation,
    city,
    className,
    onUpdatePicture
}: ProfileBannerProps) {
    return (
        <div className={twMerge('shadow-md', className)}>
            <div className="relative bg-[url('/cover.png')] bg-no-repeat bg-cover bg-center min-h-[120px]">
                <ProfileIcon size={100} src={profileIconSrc} className='absolute left-4 bottom-0 translate-y-1/2 border-4 border-white rounded-full' />
            </div>

            <div className='flex flex-col gap-4 p-4'>
                <div className='flex justify-end'>
                    <Button theme='secondary' onClick={onUpdatePicture} className='text-xs w-full max-w-[150px]'>Update Picture</Button>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-xl'>{name}</h2>
                    <p className='text-sm'>&#64;{handler} <span className='text-neutral-400'>&sdot;</span> {title} <span className='text-neutral-400'>at</span> {company} <span className='text-neutral-400'>&sdot;</span> <span className='text-neutral-400'>{pronounce}</span></p>
                    <p className='text-xs text-neutral-400'>{NATION_FLAGS[nation]} {city}, {nation}</p>
                </div>
            </div>
        </div>
    );
}