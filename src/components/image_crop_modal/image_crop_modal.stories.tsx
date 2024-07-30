import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ImageCropModal from './image_crop_modal';

const meta = {
    title: 'UI/Modal/ImageCropModal',
    component: ImageCropModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['!autodocs'],
    args: {
        open: true,
        imgSrc: '/avatar-john.png',
        onClose: fn(),
        onCrop: fn()
    },
} satisfies Meta<typeof ImageCropModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {},
}