import type { Meta, StoryObj } from '@storybook/react';
import Dnd from './dnd';

const meta = {
    title: 'UI/DragAndDrop',
    component: Dnd,
    tags: ['autodocs'],
} satisfies Meta<typeof Dnd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
}