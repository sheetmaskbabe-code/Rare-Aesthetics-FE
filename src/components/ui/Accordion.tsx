import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
  placeholder?: boolean;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-plum/15 border-y border-plum/15">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-plum"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className="font-heading text-lg text-dark-plum md:text-xl">{item.question}</span>
              <span className="mt-1 shrink-0 text-plum">
                {open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <p className={cn('pb-6 pr-10 text-sm leading-relaxed text-dark-plum/70 md:text-base')}>
                    {item.answer}
                    {item.placeholder && (
                      <span className="mt-2 block text-xs uppercase tracking-wider text-deep-blue/80">
                        Content placeholder — confirm with client before launch
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
