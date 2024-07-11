import type { Meta, StoryObj } from '@storybook/react';
import { ModalImpl as Modal } from './modal';
import { fn } from '@storybook/test';
import Button from '@/components/button/button';

const meta = {
    title: 'UI/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onClose: fn(),
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        ID: 'uploadImage',
        title: 'Upload image(s)',
        subtitle: 'You may upload up to 5 images',
        content: <div className='bg-[#E5E5E5] w-full h-[300px] p-2'>Modal Content</div>,
        className: 'min-w-[600px]',
        footer: <div className='flex justify-between gap-4'>
            <Button theme='secondary' className="text-sm px-0 py-0 w-full">Cancel</Button>
            <Button theme='primary' className="text-sm px-0 py-0 w-full" disabled>Select Image</Button>
        </div>
    },
}