import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './progress_bar';

const meta = {
    title: 'UI/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;


export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        value: 70,
        thickness: 6
    },
};

