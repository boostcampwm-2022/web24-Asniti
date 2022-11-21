import type { ReactNode, ComponentPropsWithoutRef } from 'react';

import React, { useMemo } from 'react';

const buttonHeight = {
  md: 'h-[56px]',
  sm: 'h-[40px]',
};

const buttonRounded = {
  md: 'rounded-[20px]',
  sm: 'rounded-[11px]',
};

const buttonBg = (outlined: boolean) => ({
  primary: outlined
    ? 'border-primary hover:border-primary-dark active:border-primary'
    : 'bg-primary hover:bg-primary-dark active:bg-primary',
  secondary: outlined
    ? 'border-secondary hover:border-secondary-dark active:border-secondary'
    : 'bg-secondary hover:bg-secondary-dark active:bg-secondary',
  dark: outlined
    ? 'border-indigo hover:border-titleActive active:border-indigo'
    : 'bg-indigo hover:bg-titleActive active:bg-indigo',
});

const buttonText = (outlined: boolean) => ({
  primary: outlined
    ? 'text-primary hover:text-primary-dark active:text-primary'
    : 'text-offWhite',
  secondary: outlined
    ? 'text-secondary hover:text-secondary-dark active:text-secondary'
    : 'text-offWhite',
  dark: outlined
    ? 'text-indigo hover:text-titleActive active:text-indigo'
    : 'text-offWhite',
});

const focusOutline = {
  primary: 'outline-primary-light',
  secondary: 'outline-secondary-light',
  dark: 'outline-placeholder',
};

export type ButtonSize = 'md' | 'sm';
export type ButtonColor = 'primary' | 'secondary' | 'dark';
export interface Props extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  outlined?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  size?: ButtonSize;
  color: ButtonColor;
}

const Button: React.FC<Props> = ({
  children,
  outlined = false,
  size = 'sm',
  color = 'dark',
  width,
  minWidth,
  maxWidth,
  ...restProps
}) => {
  const As = 'button';

  const style = useMemo(
    () => ({ width, minWidth, maxWidth }),
    [width, minWidth, maxWidth],
  );

  return (
    <As
      {...restProps}
      style={style}
      className={`
      ${buttonHeight[size]} ${
        buttonRounded[size]
      } focus:outline focus:outline-4 focus:-outline-offset-2 border-2 min-w-[120px] ${
        buttonBg(outlined)[color]
      } ${buttonText(outlined)[color]} ${
        focusOutline[color]
      } disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {children}
    </As>
  );
};

export default Button;
