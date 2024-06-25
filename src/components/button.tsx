import clsx from 'clsx';

type ButtonProps = {
    theme: 'primary' | 'secondary' | 'tertiary';
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

export default function Button({ theme, disabled = false, prefixIcon, suffixIcon, className, children }: ButtonProps) {
    const baseStyles = 'flex gap-2 justify-center items-center rounded focus:outline-none focus-visible:ring disabled:text-neutral-400';
    const themeStyles = clsx(
        theme === 'primary' && 'px-6 py-2 bg-indigo-700 text-white hover:bg-indigo-800 disabled:bg-neutral-200',
        theme === 'secondary' && 'px-6 py-2 bg-white text-black border border-neutral-200 hover:bg-neutral-200 disabled:bg-neutral-200',
        theme === 'tertiary' && 'px-0.5 py-0.25 text-neutral-600 hover:text-black'
    );
    const styles = clsx(baseStyles, themeStyles, className);

    return <button className={styles} disabled={disabled}>
        {prefixIcon}{children}{suffixIcon}
    </button>
}