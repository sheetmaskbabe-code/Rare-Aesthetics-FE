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
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Update visible card count based on screen size
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

  const totalItems = testimonials.length;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  // Adjust currentIndex if itemsPerPage changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Continuous auto-scroll (pauses on hover)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [handleNext, isPaused, maxIndex]);

  // Touch swipe support for mobile
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

  // Calculate dots/pages count
  const dotsCount = maxIndex + 1;

  return (
    <div
      className="relative mx-auto mt-12 max-w-6xl px-4 sm:px-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider viewport */}
      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-6"
          animate={{
            x: `-${currentIndex * (100 / itemsPerPage)}%`,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          style={{
            width: `${(totalItems / itemsPerPage) * 100}%`,
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              style={{ width: `${100 / totalItems}%` }}
              className="flex flex-col justify-between rounded-2xl border border-plum/15 bg-white/80 p-6 sm:p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8524F9]/40 hover:shadow-xl hover:-translate-y-1"
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

      {/* Pagination Indicator Dots */}
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
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
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
