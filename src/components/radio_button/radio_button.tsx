import { twMerge } from "tailwind-merge";

type RadioButtonProps = {
    size?: number,
    value: any,
    name: string,
    selected?: boolean,
    className?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function RadioButton({
    size = 20,
    value,
    name,
    selected = false,
    className,
    onChange
}: RadioButtonProps) {

    return <input
        style={{
            width: size,
            height: size
        }}
        value={value}
        name={name}
        className={twMerge("appearance-none relative cursor-pointer border-2 border-neutral-200 rounded-full hover:border-indigo-600 checked:border-indigo-600 checked:after:content-[''] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-y-1/2 checked:after:-translate-x-1/2 checked:after:w-3/4 checked:after:h-3/4 checked:after:bg-indigo-700 checked:after:rounded-full", className)}
        type="radio"
        onChange={onChange}
        defaultChecked={selected} />;
}