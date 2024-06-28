import type { Meta, StoryObj } from '@storybook/react';
import RadioButton from './radio_button';

const meta = {
    title: 'UI/RadioButton',
    component: RadioButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        value: '',
    },
} satisfies Meta<typeof RadioButton>;


export default meta;
type Story = StoryObj<typeof meta>;

export const InitialState: Story = {
    args: {
        name: 'radio-btn-1',
    },
};

export const SelectedState: Story = {
    args: {
        name: 'radio-btn-2',
    },
};

