import type { Meta, StoryObj } from '@storybook/react';
import ProfileIcon from './profile_icon';

const meta = {
    title: 'UI/ProfileIcon',
    component: ProfileIcon,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof ProfileIcon>;


export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
    args: {
        isEmpty: true,
        size: 100
    },
};


export const UploadingState: Story = {
    args: {
        src: '/avatar-john.png',
        isUploading: true,
        size: 100
    },
};

