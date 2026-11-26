import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Star, Quote, ChevronRight } from 'lucide-react';

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
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isBusyRef = useRef(false);

  // Initialize with testimonials without duplicating when 3+ items exist
  const [items, setItems] = useState<TestimonialItem[]>(() => {
    return testimonials || [];
  });

  // Keep state in sync with props
  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setItems(testimonials);
    }
  }, [testimonials]);

  // Width of 1 card + 24px gap
  const getStep = () => {
    if (!trackRef.current?.firstElementChild) return 0;
    const firstChild = trackRef.current.firstElementChild as HTMLElement;
    return firstChild.offsetWidth + 24;
  };

  // Scroll forward ONLY: shifts cards to the left, then rotates queue
  const handleScrollFront = useCallback(() => {
    if (isBusyRef.current || !trackRef.current || items.length <= 1) return;
    const step = getStep();
    if (step === 0) return;

    isBusyRef.current = true;
    const track = trackRef.current;

    // Smooth forward transition
    track.style.transition = 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translateX(-${step}px)`;

    // Once the forward slide completes, rotate array forward and reset transform with 0ms transition
    setTimeout(() => {
      setItems((prev) => (prev.length > 1 ? [...prev.slice(1), prev[0]] : prev));
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = 'translateX(0)';
      }
      isBusyRef.current = false;
    }, 620);
  }, [items.length]);

  // Continuous auto-slide: strictly forward only, never backwards
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isBusyRef.current) {
        handleScrollFront();
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [handleScrollFront, testimonials]);

  // Mobile swipe: left swipe slides forward
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    // Any swipe triggers forward progression
    if (Math.abs(diff) > 40) {
      handleScrollFront();
    }
    touchStartX.current = null;
  };

  if (!items || items.length === 0) {
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Front Navigation Control placed at UP */}
      <div className="flex items-center justify-between sm:justify-end gap-3 mb-6">
        <span className="text-xs uppercase tracking-widest text-plum/50 font-medium">
          Verified Reviews ({testimonials.length})
        </span>
        <button
          type="button"
          onClick={handleScrollFront}
          aria-label="Next testimonial"
          title="Scroll next testimonial"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-plum/20 bg-white/90 text-plum shadow-sm transition-all duration-300 hover:bg-[#8524F9] hover:text-white hover:border-[#8524F9] hover:shadow-md cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Overflow Hidden Slider Viewport */}
      <div className="overflow-hidden py-4">
        <div
          ref={trackRef}
          style={{ transform: 'translateX(0)' }}
          className="flex gap-6 will-change-transform"
        >
          {items.map((t, idx) => (
            <div
              key={`${t.author}-${idx}`}
              className="shrink-0 w-[84vw] sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)] flex flex-col justify-between rounded-2xl border border-plum/15 bg-white/85 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8524F9]/40 hover:shadow-xl hover:-translate-y-1"
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
    </div>
  );
}
