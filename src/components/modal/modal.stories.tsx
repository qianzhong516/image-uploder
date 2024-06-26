import type { Meta, StoryObj } from '@storybook/react';
import Modal from './modal';
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
        onClose: fn()
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        title: 'Upload image(s)',
        subtitle: 'You may upload up to 5 images',
        children: <div className='bg-[#E5E5E5] w-full h-[300px] p-2'>Modal Content</div>,
        className: 'min-w-[600px]',
        leftButton: ({ className }) => <Button theme='secondary' className={className}>Cancel</Button>,
        rightButton: ({ className }) => <Button theme='secondary' className={className} disabled>Select Image</Button>
    }
}