import Button from '@/components/button/button';
import CloseIcon from '@/components/icons/close';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { ModalContext, ModalKey } from './modalContext';
import { useContext, useEffect, } from 'react';
import { Transition, TransitionChild } from '@headlessui/react'

type ModalProps = {
    ID: ModalKey,
    title: string,
    subtitle?: string,
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
            <div className='flex justify-between w-full items-center'>
                <div className='flex flex-col gap'>
                    <h1 className="text-lg">{title}</h1>
                    {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
                </div>
                <Button theme='tertiary' onClick={onClose}><CloseIcon /></Button>
            </div>
            {content}
            {footer}
        </div>
    );
}

const Backdrop = ({ children }: { children: React.ReactNode }) =>
    <div className='fixed inset-0 w-full h-full bg-neutral-950/40 backdrop-blur-sm flex justify-center'>{children}</div>;

export default function Modal({
    open,
    ...props
}: ModalProps & {
    open: boolean,
}) {
    const { modals, updateModals } = useContext(ModalContext);
    const id = props.ID;
    const currentKey = modals.at(-1);

    useEffect(() => {
        // we don't want a modal key gets added when the modal is not open
        if (open) {
            updateModals(modals => Array.from(new Set([...modals, id])));
        }

        return () => updateModals(modals => modals.filter(m => m !== id));
    }, [id, open, updateModals]);

    return currentKey === id && open &&
        createPortal(
            <Transition show={open} appear={true}>
                <TransitionChild
                    enter="ease-in-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-out"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className='transition duration-[250ms]'>
                        <Backdrop >
                            <TransitionChild
                                enter="ease-in-out"
                                enterFrom="scale-0"
                                enterTo="scale-100"
                                leave="ease-out"
                                leaveFrom="scale-100"
                                leaveTo="scale-0">
                                <div className='transition duration-[250ms]'>
                                    <ModalImpl {...props} />
                                </div>
                            </TransitionChild>
                        </Backdrop>
                    </div>
                </TransitionChild>
            </Transition>,
            document.body);
}