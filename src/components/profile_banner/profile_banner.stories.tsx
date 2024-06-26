import type { Meta, StoryObj } from '@storybook/react';
import ProfileBanner from './profile_banner';
import { fn } from '@storybook/test';
import Image from 'next/image';

const meta = {
    title: 'UI/ProfileBanner',
    component: ProfileBanner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onUpdatePicture: fn()
    },
} satisfies Meta<typeof ProfileBanner>;

export default meta;
type Story = StoryObj<typeof meta>;


export const View: Story = {
    args: {
        profileIconSrc: '/avatar-jack.jpg',
        name: 'Jack Smith',
        handler: 'kingjack',
        title: 'Senior Product Designer',
        company: <><Image src='/webflow.png' width={18} height={18} alt='' className='inline' /> Webflow</>,
        pronounce: 'He/Him',
        city: 'Vancouver',
        nation: 'Canada',
        className: 'min-w-[550px]'
    },
};