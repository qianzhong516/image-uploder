import { ImageItemProps } from './image_item';
import ImageItem from './image_item';

export type ImageListProps = ({
    id: string,
} & ImageItemProps)[]

export default function ImageList({
    imageItems
}: { imageItems: ImageListProps }) {
    return <div className='flex flex-col gap-6'>
        {imageItems.map(itemProps => <ImageItem key={itemProps.id} {...itemProps} />)}
    </div>
}