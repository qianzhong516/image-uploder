import type { Meta, StoryObj } from '@storybook/react';
import Dnd from './dnd';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/DragAndDrop',
    component: Dnd,
    tags: ['autodocs'],
    args: {
        uploadFiles: fn()
    }
} satisfies Meta<typeof Dnd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllowMultipleUploads: Story = {
    args: {
        multiple: true
    }
}

export const AllowSingleUpload: Story = {
    args: {
        multiple: false
    }
}