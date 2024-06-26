import Button from '@/components/button/button';
import CloseIcon from '@/components/icons/close';
import { twMerge } from 'tailwind-merge';

type ModalProps = {
    title: string,
    subtitle: string,
    children: React.ReactNode,
    leftButton: ({ className }: { className: string }) => JSX.Element,
    rightButton: ({ className }: { className: string }) => JSX.Element,
    className?: string,
    onClose: () => void,
}

export default function Modal({
    title,
    subtitle,
    children,
    leftButton,
    rightButton,
    className,
    onClose,
}: ModalProps) {
    const buttonStyles = 'text-sm px-0 py-0 w-full';

    return (
        <div className={twMerge('flex flex-col gap-6 p-4 shadow-md', className)}>
            <div className='flex justify-between w-full'>
                <div className='flex flex-col gap'>
                    <h1 className="text-lg">{title}</h1>
                    <p className="text-sm text-neutral-400">{subtitle}</p>
                </div>
                <Button theme='tertiary' onClick={onClose}><CloseIcon /></Button>
            </div>
            <div>
                {children}
            </div>
            <div className='flex justify-between gap-4'>
                {leftButton({ className: buttonStyles })}
                {rightButton({ className: buttonStyles })}
            </div>
        </div>
    );
}