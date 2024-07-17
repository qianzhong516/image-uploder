import type { Meta, StoryObj } from '@storybook/react';
import RadioButton from './radio_button';
import { fn } from '@storybook/test';

const meta = {
    title: 'UI/RadioButton',
    component: RadioButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof RadioButton>;


export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
    args: {
        name: 'radio-btn-1',
        value: '',
        size: 32,
        selected: true,
        onChange: fn()
    },
};
