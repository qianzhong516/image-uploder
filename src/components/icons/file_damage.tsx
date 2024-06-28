import { makeIcon, SVGProps } from "./make-icon"

function FileDamage({ size }: SVGProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M19 9H14V4H5V11.8571L6.5 13.25L10 9.5L13 14.5L15 12L18 15L15 14.5L13 17L10 13L7 16.5L5 15.25V20H19V9ZM21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8Z"></path></svg>
}

const FileDamageIcon = makeIcon(FileDamage);

export default FileDamageIcon;