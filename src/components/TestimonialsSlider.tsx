import React, { useMemo } from 'react';
import { Star, Quote } from 'lucide-react';

export type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
};

type TestimonialsSliderProps = {
  testimonials: TestimonialItem[];
};

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure there are at least 5 cards in the base list so the track fills wide displays
  const baseItems = useMemo(() => {
    let items = [...testimonials];
    while (items.length < 5) {
      items = [...items, ...testimonials];
    }
    return items;
  }, [testimonials]);

  // Duplicate the base list once so translateX(0) -> translateX(-50%) creates a seamless infinite loop
  const trackItems = useMemo(() => {
    return [...baseItems, ...baseItems];
  }, [baseItems]);

  // Comfortable reading duration based on item count
  const durationSeconds = Math.max(28, baseItems.length * 7);

  return (
    <div className="relative mx-auto mt-10 w-full overflow-hidden select-none py-4">
      {/* Edge gradient fade masks for seamless luxury appearance */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-20 bg-gradient-to-r from-lavender to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-20 bg-gradient-to-l from-lavender to-transparent" />

      {/* Infinite Forward Scroll Track (Continuous Forward Movement - Zero Back-Slide) */}
      <div
        className="testimonials-scroll-track gap-6"
        style={
          {
            '--marquee-duration': `${durationSeconds}s`,
          } as React.CSSProperties
        }
      >
        {trackItems.map((t, idx) => (
          <div
            key={idx}
            className="w-[310px] sm:w-[380px] md:w-[420px] shrink-0 flex flex-col justify-between rounded-2xl border border-plum/15 bg-white/85 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8524F9]/40 hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                    <Star key={rIdx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-plum/20" />
              </div>
              <p className="font-alt text-sm sm:text-base leading-relaxed text-dark-plum/85 italic">
                “{t.quote}”
              </p>
            </div>

            <div className="mt-6 border-t border-plum/10 pt-4">
              <p className="font-heading font-bold text-sm sm:text-base text-plum tracking-tight">
                {t.author}
              </p>
              {t.role && (
                <p className="mt-0.5 text-xs text-dark-plum/60 font-medium">{t.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
