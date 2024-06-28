import { makeIcon, SVGProps } from "./make-icon"

const Crop = ({ size }: SVGProps) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M15 17V19H6C5.44772 19 5 18.5523 5 18V7H2V5H5V2H7V17H15ZM17 22V7H9V5H18C18.5523 5 19 5.44772 19 6V17H22V19H19V22H17Z"></path></svg>
}

const CropIcon = makeIcon(Crop);

export default CropIcon;