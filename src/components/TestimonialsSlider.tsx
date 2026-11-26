import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
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
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isBusyRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // Guarantee at least 6 cards in queue so 3 are visible and buffer cards exist
  const initialItems = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    let list = [...testimonials];
    while (list.length < 6) {
      list = [...list, ...testimonials];
    }
    return list;
  }, [testimonials]);

  const [items, setItems] = useState<TestimonialItem[]>(initialItems);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync if prop updates
  useEffect(() => {
    setItems(initialItems);
    setTranslateX(0);
    setIsTransitioning(false);
    isBusyRef.current = false;
  }, [initialItems]);

  // Width of 1 card + 24px gap
  const getStep = () => {
    if (!trackRef.current?.firstElementChild) return 0;
    const firstChild = trackRef.current.firstElementChild as HTMLElement;
    return firstChild.offsetWidth + 24;
  };

  // Next (front) arrow handler: ALWAYS moves forward (leftwards)
  const handleNext = useCallback(() => {
    if (isBusyRef.current) return;
    const step = getStep();
    if (step === 0) return;

    isBusyRef.current = true;
    setIsTransitioning(true);
    setTranslateX(-step);
  }, []);

  // Prev (back) arrow handler: moves previous card smoothly in from left
  const handlePrev = useCallback(() => {
    if (isBusyRef.current) return;
    const step = getStep();
    if (step === 0) return;

    isBusyRef.current = true;

    // 1. Move last card to front
    setItems((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);

    // 2. Instantly shift translateX to -step (no transition)
    setIsTransitioning(false);
    setTranslateX(-step);

    // 3. Next frame: animate to 0 so previous card slides smoothly into view
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
        setTranslateX(0);
      });
    });
  }, []);

  // When transition finishes
  const handleTransitionEnd = () => {
    if (!isTransitioning) return;

    if (translateX < 0) {
      // Completed forward slide: shift first card to back and reset translateX to 0 with NO animation
      setItems((prev) => [...prev.slice(1), prev[0]]);
    }

    setIsTransitioning(false);
    setTranslateX(0);
    isBusyRef.current = false;
  };

  // Automatic slide: ALWAYS forward, never reverses or back-slides
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isBusyRef.current) {
        handleNext();
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [handleNext, testimonials]);

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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

      {/* Overflow Hidden Slider Viewport */}
      <div className="overflow-hidden py-4">
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isTransitioning
              ? 'transform 550ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
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
