import Button from '@/components/button/button';
import CloseIcon from '@/components/icons/close';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

type ModalProps = {
    title: string,
    subtitle: string,
    content: React.ReactNode,
    footer: React.ReactNode,
    className?: string,
    onClose: () => void,
}

export function ModalImpl({
    title,
    subtitle,
    content,
    footer,
    className,
    onClose,
}: ModalProps) {
    return (
        <div className={twMerge('flex flex-col gap-6 p-4 shadow-md bg-white rounded-md', className)}>
            <div className='flex justify-between w-full'>
                <div className='flex flex-col gap'>
                    <h1 className="text-lg">{title}</h1>
                    <p className="text-sm text-neutral-400">{subtitle}</p>
                </div>
                <Button theme='tertiary' onClick={onClose}><CloseIcon /></Button>
            </div>
            {content}
            {footer}
        </div>
    );
}

const Backdrop = ({ children }: { children: React.ReactNode }) =>
    <div className='fixed inset-0 w-full h-full bg-neutral-950/60'>{children}</div>;

export default function Modal({
    container,
    open,
    ...props
}: ModalProps & {
    container: HTMLElement,
    open: boolean,
}) {

    return open && createPortal(
        <Backdrop>
            <ModalImpl {...props} />
        </Backdrop>, container
    )
}