type ProgressBarProps = {
    value: number,
    thickness: number,
}

export default function ProgressBar({
    value,
    thickness
}: ProgressBarProps) {
    const val = Math.min(Math.max(0, value), 100);
    return (
        <div className="flex gap-4 items-center">
            <div style={{ height: thickness }} className="relative w-full bg-gray-200 rounded-full">
                <div style={{ width: `${val}%`, height: thickness }} className="absolute left-0 top-0 transition-all bg-indigo-700 rounded-full"></div>
            </div>

            <span className="text-xs">{val}%</span>
        </div>
    )
}