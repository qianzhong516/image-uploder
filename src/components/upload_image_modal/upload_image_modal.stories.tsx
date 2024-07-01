import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import UploadImageModal from './upload_image_modal';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/UploadImgModal',
    component: UploadImageModal,
    tags: ['!autodocs'],
    args: {
    }
} satisfies Meta<typeof UploadImageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        allowMutiple: true,
        imageList: <div></div>,
        uploadFiles: fn(),
    },
    render: (args) => {
        const [_, updateArgs, resetArgs] = useArgs();

        return <div>
            <UploadImageModal {...args} />
        </div>;
    }
}