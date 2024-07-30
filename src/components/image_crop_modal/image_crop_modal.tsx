import Modal from '@/components/modal/modal';
import Button from '@/components/button/button'
import { useEffect, useRef } from 'react';
import CropperImpl, { ReactCropperElement } from "react-cropper";
import "@/lib/cropperjs/cropper.css";
import CropperTypes from 'cropperjs';

type ImageCropModalProps = {
    open: boolean,
    imgSrc: string,
    onClose: () => void,
    onCrop: (cropData: CropperTypes.CropBoxData, cropRatio: number) => void
}

type CropperProps = {
    imgSrc: string,
    onCropMove?: (cropData: CropperTypes.CropBoxData, cropRatio: number) => void,
}

const Cropper = ({ imgSrc, onCropMove }: CropperProps) => {
    const cropperRef = useRef<ReactCropperElement>(null);
    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) {
            return;
        }

        const cropBoxData = cropper.getCropBoxData();
        const canavsData = cropper.getCanvasData();
        onCropMove?.({
            left: cropBoxData.left - canavsData.left,
            top: cropBoxData.top - canavsData.top,
            width: cropBoxData.width,
            height: cropBoxData.height,
        }, canavsData.naturalWidth / canavsData.width);
    };
    const timer = useRef<NodeJS.Timeout | null>(null);

    // customise the styles of the cropper
    useEffect(() => {
        timer.current = setInterval(() => {
            if (!cropperRef.current) {
                return;
            }

            const lines = cropperRef.current.parentNode?.querySelectorAll('.cropper-line');
            const pointers = cropperRef.current.parentNode?.querySelectorAll('.cropper-point');

            if (lines && lines.length && pointers && pointers.length) {
                timer.current && clearInterval(timer.current)
                lines.forEach(line => line.classList.add('!hidden'));
                Array.from(pointers).slice(0, 4).forEach(p => p.classList.add('!hidden'));
            }
        }, 100);

        return () => { timer.current && clearInterval(timer.current) };
    }, [])

    return (
        <CropperImpl
            src={imgSrc}
            minContainerHeight={150}
            aspectRatio={1}
            guides={false}
            crop={onCrop}
            dragMode='none'
            viewMode={1} // cropbox is restrict to the canavs
            ref={cropperRef}
        />
    );
};

export default function ImageCropModal({
    open,
    imgSrc,
    onClose,
    onCrop
}: ImageCropModalProps) {
    const cropBoxData = useRef<CropperTypes.CropBoxData>();
    const cropRatioRef = useRef<number | null>(null);

    const onCropMove = (props: CropperTypes.CropBoxData, cropRatio: number) => {
        cropBoxData.current = props;
        cropRatioRef.current = cropRatio;
    }
    const onConfirm = () => {
        cropBoxData.current && onCrop(cropBoxData.current, cropRatioRef.current!);
    }

    const content = <Cropper imgSrc={imgSrc} onCropMove={onCropMove} />

    const footer = (<div className='flex justify-between gap-4'>
        <Button theme='secondary' className="text-sm px-0 py-0 w-full" onClick={onClose}>Cancel</Button>
        <Button theme='primary' className="text-sm px-0 py-0 w-full" onClick={onConfirm}>Confirm</Button>
    </div>);

    return (
        <Modal
            className='max-w-[300px] m-auto'
            open={open}
            title='Crop your picture'
            content={content}
            footer={footer}
            onClose={onClose} />
    );
}