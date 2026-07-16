import React from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]',
  secondary: 'bg-white/10 text-slate-100 hover:bg-white/20 active:bg-white/5 border border-white/5',
  danger: 'bg-rose-500 text-white hover:bg-rose-400 active:bg-rose-600',
  ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/5',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 py-2 rounded-lg',
  lg: 'h-12 px-6 py-3 text-lg rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'inline-flex items-center justify-center font-medium gap-2',
      'transition-all duration-200',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return (
      <Component
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="absolute inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <div className={clsx('flex items-center gap-2', isLoading && 'opacity-0')}>
          {leftIcon}
          {children}
          {rightIcon}
        </div>
      </Component>
    );
  }
);

Button.displayName = 'Button';
