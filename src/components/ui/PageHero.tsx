import { Reveal } from './Reveal';

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-hero-mesh border-b border-plum/10">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 md:pb-20 md:pt-40">
        <Reveal>
          {eyebrow && (
            <p className="mb-4 font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-4xl font-heading text-4xl font-medium leading-[1.1] text-plum md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-dark-plum/70 md:text-lg">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
