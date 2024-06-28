import type { Meta, StoryObj } from '@storybook/react';
import ImageItem from './image_item';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/ImageItem',
    component: ImageItem,
    parameters: {
    },
    tags: ['autodocs'],
    args: {
        title: 'IMG_0083.jpg',
        totalSize: '331kb',
        imgSrc: '/avatar-image-item.png'
    },
} satisfies Meta<typeof ImageItem>;


export default meta;
type Story = StoryObj<typeof meta>;

export const InitialState: Story = {
    args: {
        state: 'initial',
        onCropImage: fn(),
        onDelete: fn()
    },
};

export const LoadingState: Story = {
    args: {
        state: 'loading',
        progress: 34,
        onCancelUpload: fn()
    },
};

