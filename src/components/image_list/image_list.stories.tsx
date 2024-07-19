import type { Meta, StoryObj } from '@storybook/react';
import ImageList from './image_list';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/ImageList',
    component: ImageList,
    parameters: {
    },
    tags: ['autodocs'],
    args: {
        imageItems: [
            { id: '1', state: 'complete', title: 'Image1', totalSize: '200kb', imgSrc: '/avatar-image-item.png', onDelete: fn(), openCropper: fn(), onChangeSelection: fn(), selected: true },
            { id: '2', state: 'loading', title: 'Image2', totalSize: '330kb', progress: 50, imgSrc: '/avatar-image-item.png', onCancelUpload: fn() },
            { id: '3', state: 'load-success', title: 'Image3', totalSize: '400kb', imgSrc: '/avatar-image-item.png', onDelete: fn() },
            { id: '4', state: 'error', title: 'Image4', totalSize: '200kb', error: 'This image is larger than 5MB. Please select a smaller image.', onDelete: fn() },
        ]
    },
} satisfies Meta<typeof ImageList>;


export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {},
};

