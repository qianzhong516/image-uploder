import type { Meta, StoryObj } from '@storybook/react';
import UploadImageModal from './upload_image_modal';
import { fn } from '@storybook/test';
import Button from '@/components/button/button';

const meta = {
    title: 'UI/UploadImgModal',
    component: UploadImageModal,
    tags: ['!autodocs'],
} satisfies Meta<typeof UploadImageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        allowMutiple: true,
        uploadFiles: fn(),
    },
}