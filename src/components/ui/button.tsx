import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark';

const variants: Record<Variant, string> = {
  primary: 'bg-plum text-white hover:bg-dark-plum shadow-sm shadow-plum/20',
  secondary: 'bg-orchid/70 text-dark-plum hover:bg-orchid',
  ghost: 'bg-transparent text-plum hover:bg-orchid/30',
  outline: 'border border-plum/30 text-plum hover:border-plum hover:bg-white/40',
  dark: 'bg-dark-plum text-lavender hover:bg-plum',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue/40 disabled:opacity-50';

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLAnchorElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'className'>;

export function Button({
  variant = 'primary',
  className,
  children,
  to,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (to) {
    return (
      <Link to={to} onClick={onClick as MouseEventHandler<HTMLAnchorElement>} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
