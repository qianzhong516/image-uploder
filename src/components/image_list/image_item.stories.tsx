import type { Meta, StoryObj } from '@storybook/react';
import ImageItem from './image_item';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/ImageList/ImageItem',
    component: ImageItem,
    parameters: {
    },
    tags: ['autodocs'],
    args: {
        title: 'IMG_0083.jpg',
        totalSize: '331kb',
    },
} satisfies Meta<typeof ImageItem>;


export default meta;
type Story = StoryObj<typeof meta>;

export const InitialState: Story = {
    args: {
        state: 'complete',
        imgSrc: '/avatar-image-item.png',
        selected: false,
        openCropper: fn(),
        onDelete: fn(),
        onChangeSelection: fn()
    },
};

export const LoadingState: Story = {
    args: {
        state: 'loading',
        imgSrc: '/avatar-image-item.png',
        progress: 44,
        onCancelUpload: fn()
    },
};

export const LoadSuccessState: Story = {
    args: {
        state: 'load-success',
        imgSrc: '/avatar-image-item.png',
        onDelete: fn()
    },
};

export const ErrorState: Story = {
    args: {
        state: 'error',
        onDelete: fn(),
        error: 'This image is larger than 5MB. Please select a smaller image.'
    },
};

