import { cn } from '@/lib/utils';

export function Section({
  children,
  className,
  id,
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 md:py-28',
        dark ? 'bg-dark-plum text-lavender' : '',
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  titleClassName,
  description,
  descriptionClassName,
  light,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  light?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p
          className={cn(
            'mb-4 font-alt text-xs uppercase tracking-[0.28em]',
            light ? 'text-orchid' : 'text-deep-blue'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-heading text-3xl font-medium leading-tight md:text-5xl',
          light ? 'text-lavender' : 'text-plum',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed md:text-lg',
            light ? 'text-lavender/75' : 'text-dark-plum/70',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
