import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const touchStartX = useRef<number | null>(null);

  // Responsive items count based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = testimonials?.length || 0;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  // Keep currentIndex in bounds if screen resized
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Reliable, continuous auto-slide every 3.2 seconds
  useEffect(() => {
    if (maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3200);

    return () => clearInterval(interval);
  }, [maxIndex]);

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const dotsCount = maxIndex + 1;
  const gapRem = 1.5; // 24px gap between cards

  return (
    <div
      className="relative mx-auto mt-12 max-w-6xl px-4 sm:px-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Viewport */}
      <div className="overflow-hidden py-4">
        <motion.div
          className="flex"
          style={{ gap: `${gapRem}rem` }}
          animate={{
            x: `calc(-${currentIndex} * ((100% - ${(itemsPerPage - 1) * gapRem}rem) / ${itemsPerPage} + ${gapRem}rem))`,
          }}
          transition={{
            duration: 0.85,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              style={{
                width: `calc((100% - ${(itemsPerPage - 1) * gapRem}rem) / ${itemsPerPage})`,
              }}
              className="shrink-0 flex flex-col justify-between rounded-2xl border border-plum/15 bg-white/80 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8524F9]/40 hover:shadow-xl hover:-translate-y-1"
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
        </motion.div>
      </div>

      {/* Slide Position Indicator Dots */}
      {dotsCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: dotsCount }).map((_, dIdx) => {
            const isActive = dIdx === currentIndex;
            return (
              <button
                key={dIdx}
                type="button"
                onClick={() => setCurrentIndex(dIdx)}
                aria-label={`Go to slide ${dIdx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'w-8 bg-[#8524F9]'
                    : 'w-2.5 bg-plum/25 hover:bg-plum/50'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
