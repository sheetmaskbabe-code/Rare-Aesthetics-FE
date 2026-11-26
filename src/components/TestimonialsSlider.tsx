import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // We create 5 repeated copies so there is plenty of continuous runway
  // and the buffer normalization is completely seamless with zero back-sliding
  const trackItems = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    return [
      ...testimonials,
      ...testimonials,
      ...testimonials,
      ...testimonials,
      ...testimonials,
    ];
  }, [testimonials]);

  // Calculate width of one card + gap
  const getStepWidth = () => {
    if (!containerRef.current) return 380;
    const firstCard = containerRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return 380;
    // 24px gap (1.5rem)
    return firstCard.offsetWidth + 24;
  };

  // On initial mount, position scroll in the middle set (set index 2)
  useEffect(() => {
    if (!containerRef.current || !testimonials || testimonials.length === 0) return;
    const step = getStepWidth();
    const singleSetWidth = testimonials.length * step;
    containerRef.current.scrollLeft = singleSetWidth * 2;
    setMounted(true);
  }, [testimonials]);

  // Infinite normalization: when scrolling stops, silently normalize to middle set
  const handleScroll = () => {
    if (!containerRef.current || !testimonials || testimonials.length === 0) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const step = getStepWidth();
      const singleSetWidth = testimonials.length * step;
      const current = containerRef.current.scrollLeft;

      // If user has navigated far right into set 3 or 4, normalize back to set 2 silently
      if (current >= singleSetWidth * 3.5) {
        containerRef.current.scrollLeft -= singleSetWidth;
      } else if (current <= singleSetWidth * 0.8) {
        // If navigated far left into set 0, normalize forward to set 2 silently
        containerRef.current.scrollLeft += singleSetWidth;
      }
    }, 150);
  };

  // Next (front) arrow handler
  const handleNext = () => {
    if (!containerRef.current) return;
    const step = getStepWidth();
    containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  // Prev (back) arrow handler
  const handlePrev = () => {
    if (!containerRef.current) return;
    const step = getStepWidth();
    containerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
  };

  // Auto slide forward every 3.5s (pauses on hover, never back-slides)
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && containerRef.current) {
        handleNext();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div
      className="relative mx-auto mt-8 w-full max-w-6xl select-none px-4 sm:px-6"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Front and Back Navigation Arrows Placed at UP */}
      <div className="flex items-center justify-between sm:justify-end gap-3 mb-6">
        <span className="text-xs uppercase tracking-widest text-plum/50 font-medium sm:hidden">
          Swipe or navigate
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-plum/20 bg-white/90 text-plum shadow-sm transition-all duration-300 hover:bg-[#8524F9] hover:text-white hover:border-[#8524F9] hover:shadow-md cursor-pointer active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-plum/20 bg-white/90 text-plum shadow-sm transition-all duration-300 hover:bg-[#8524F9] hover:text-white hover:border-[#8524F9] hover:shadow-md cursor-pointer active:scale-95"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Cards Viewport */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {trackItems.map((t, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 w-[84vw] sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)] flex flex-col justify-between rounded-2xl border border-plum/15 bg-white/85 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8524F9]/40 hover:shadow-xl hover:-translate-y-1"
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
