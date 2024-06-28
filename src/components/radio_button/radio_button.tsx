type RadioButtonProps = {
    size?: number,
    value: any,
    name: string,
}

export default function RadioButton({
    size = 16,
    value,
    name,
}: RadioButtonProps) {

    return <input
        style={{
            width: size,
            height: size
        }}
        value={value}
        name={name}
        className="appearance-none relative cursor-pointer border-2 border-neutral-200 rounded-full hover:border-indigo-600 checked:border-indigo-600 checked:after:content-[''] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-y-1/2 checked:after:-translate-x-1/2 checked:after:w-3/4 checked:after:h-3/4 checked:after:bg-indigo-700 checked:after:rounded-full"
        type="radio" />;
}