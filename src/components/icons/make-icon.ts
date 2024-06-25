export type SVGProps = {
  size: number;
};

type IconProps = {
  size?: 'sm' | 'md' | 'lg' | number;
};

export const makeIcon = (IconComponent: React.FC<SVGProps>) => {
  return ({ size = 'md' }: IconProps) => {
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
