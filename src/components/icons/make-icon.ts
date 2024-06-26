export type SVGProps = {
  size: number;
};

type IconProps = {
  size?: 'sm' | 'md' | 'lg' | number;
};

export const makeIcon = (IconComponent: React.FC<SVGProps>) => {
  // returns a higher order component that defines icon size
  return ({ size = 'sm' }: IconProps) => {
    const actualSize =
      size === 'sm'
        ? 20
        : size === 'md'
          ? 40
          : size === 'lg'
            ? 80
            : size;
    return IconComponent({
      size: actualSize,
    });
  };
};
