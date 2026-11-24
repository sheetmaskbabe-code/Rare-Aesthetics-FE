import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { processChapters } from '@/data/process';

const processSlides = [
  {
    title: 'Structured Process',
    description:
      'A clear, research-driven development journey from discovery and formulation to commercial product launch.',
    media: '/images/process-bottles.jpg',
  },
  {
    title: 'Discovery & Briefing',
    description:
      'Establishing your brand vision, performance targets, active ingredient preferences, and product roadmap.',
    media:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Concept & Formulation',
    description:
      'Transforming creative ideas into bench-tested prototypes with meticulous attention to luxury sensory feel.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Testing & Stability',
    description:
      'Rigorous microbiological, stability, and compatibility testing ensuring uncompromising safety and efficacy.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Scale & Manufacturing',
    description:
      'Seamless batch scaling, contract manufacturer liaison, and packaging assembly coordination.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Launch Readiness',
    description:
      'Final quality audits, regulatory compliance checks, and market delivery alignment.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

type ProcessRowItem = {
  step: string;
  tag?: string;
  title: string;
  description: string;
  proceedText?: string;
  isAction?: boolean;
  actionText?: string;
  actionUrl?: string;
  secondaryActionText?: string;
  secondaryActionUrl?: string;
};

function CreamDroplet({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none z-20 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Soft cosmetic glow */}
        <span className="absolute -inset-2.5 rounded-full bg-orchid/50 blur-md animate-pulse" />
        <span className="absolute -inset-1 rounded-full bg-white/70 blur-xs" />

        {/* 3D Luxury Cosmetic Cream Dollop SVG */}
        <svg
          viewBox="0 0 32 32"
          className="relative h-9 w-9 filter drop-shadow-[0_4px_10px_rgba(95,58,104,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base cream depth shadow */}
          <path
            d="M16 3C16 3 7.5 11.5 7.5 19C7.5 23.7 11.3 27.5 16 27.5C20.7 27.5 24.5 23.7 24.5 19C24.5 11.5 16 3 16 3Z"
            fill="url(#creamGradientDark)"
            opacity="0.3"
            transform="translate(0, 1.5)"
          />
          {/* Main whipped cream dollop body */}
          <path
            d="M16 3C16 3 7.5 11.5 7.5 19C7.5 23.7 11.3 27.5 16 27.5C20.7 27.5 24.5 23.7 24.5 19C24.5 11.5 16 3 16 3Z"
            fill="url(#creamGradientBody)"
          />
          {/* Cream swirl swirl contour */}
          <path
            d="M16 4C17.5 6.8 18.5 10 18 12.8C17.4 15 15.2 16.5 14 18.2C13 19.8 13.2 22 14.8 23.5"
            stroke="url(#creamSwirlGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Glossy specular reflection */}
          <path
            d="M11.5 12.5C10.3 14.8 10 17.5 10.5 20"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Shimmer points */}
          <circle cx="12.5" cy="10.5" r="1.3" fill="#ffffff" />
          <circle cx="19.5" cy="20.5" r="1.6" fill="#ffffff" opacity="0.85" />

          <defs>
            <radialGradient id="creamGradientBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fffbfc" />
              <stop offset="70%" stopColor="#f3dfee" />
              <stop offset="100%" stopColor="#d5b2dd" />
            </radialGradient>
            <linearGradient id="creamGradientDark" x1="16" y1="3" x2="16" y2="27.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5f3a68" />
              <stop offset="1" stopColor="#35213b" />
            </linearGradient>
            <linearGradient id="creamSwirlGradient" x1="16" y1="4" x2="16" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#d5b2dd" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function getConnectorDropletPos(vProg: number) {
  // vProg from 0 to 1 along S-curve
  if (vProg <= 0.2) {
    const t = vProg / 0.2;
    return { left: '97.2%', top: `${t * 55}%` };
  } else if (vProg <= 0.85) {
    const t = (vProg - 0.2) / 0.65;
    return { left: `${97.2 - t * 94.4}%`, top: '62.5%' };
  } else {
    const t = (vProg - 0.85) / 0.15;
    return { left: '2.8%', top: `${62.5 + t * 32.5}%` };
  }
}

function RowConnector({
  vProg = 0,
  isActive = false,
}: {
  vProg: number;
  isActive: boolean;
}) {
  return (
    <div className="hidden md:block relative w-full h-20 -my-2 pointer-events-none z-0">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1000 80"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Base physical connecting track */}
        <path
          d="M 972 0 L 972 30 Q 972 50 940 50 L 60 50 Q 28 50 28 72"
          stroke="#5f3a68"
          strokeOpacity="0.22"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Active physical cream line fill */}
        <path
          d="M 972 0 L 972 30 Q 972 50 940 50 L 60 50 Q 28 50 28 72"
          stroke="url(#creamConnectorGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1000}
          strokeDasharray="1000"
          strokeDashoffset={1000 * (1 - Math.min(1, Math.max(0, vProg)))}
          className="transition-all duration-75 ease-out shadow-[0_0_10px_#d5b2dd]"
        />

        <defs>
          <linearGradient id="creamConnectorGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d5b2dd" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d5b2dd" />
          </linearGradient>
        </defs>
      </svg>

      {/* Downward arrow physically meeting the next row's node */}
      <div className="absolute bottom-0 left-7 -translate-x-1/2 translate-y-2 text-plum">
        <ArrowDown
          className={`h-4 w-4 transition-colors duration-300 ${
            vProg >= 0.85 ? 'text-orchid drop-shadow-[0_0_6px_#d5b2dd]' : 'text-plum'
          }`}
        />
      </div>

      {/* Cream Droplet moving along this S-curve connector */}
      {isActive && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={getConnectorDropletPos(vProg)}
        >
          <CreamDroplet />
        </div>
      )}
    </div>
  );
}

export function Process() {
  const slides = usePageHeader('process', processSlides);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [processData, setProcessData] = useState<{
    eyebrow?: string;
    title?: string;
    description?: string;
    steps?: ProcessRowItem[];
  }>({
    eyebrow: 'Our Approach',
    title: 'The Pathway to Beauty Innovation',
    description:
      'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
  });

  useEffect(() => {
    fetch('/api/process-content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content) {
          setProcessData(data.content);
        }
      })
      .catch(() => {});
  }, []);

  const allSteps: ProcessRowItem[] = useMemo(() => {
    if (processData.steps && processData.steps.length > 0) {
      return processData.steps;
    }
    return [
      ...processChapters,
      {
        step: '08',
        title: 'Begin Your Project Journey',
        description:
          'Connect with our team to discuss your formulation goals, packaging considerations, and production roadmap. We partner with emerging and established beauty innovators across South Africa and beyond.',
        isAction: true,
        actionText: 'Book a Consultation',
        actionUrl: '/contact',
      },
    ];
  }, [processData.steps]);

  const rows: { left: ProcessRowItem; right: ProcessRowItem }[] = useMemo(() => {
    const list: { left: ProcessRowItem; right: ProcessRowItem }[] = [];
    for (let i = 0; i < allSteps.length; i += 2) {
      const left = allSteps[i];
      const right = allSteps[i + 1] || {
        step: String(i + 2).padStart(2, '0'),
        title: 'Begin Your Project Journey',
        description:
          'Connect with our team to discuss your formulation goals, packaging considerations, and production roadmap. We partner with emerging and established beauty innovators across South Africa and beyond.',
        isAction: true,
        actionText: 'Book a Consultation',
        actionUrl: '/contact',
      };
      list.push({ left, right });
    }
    return list;
  }, [allSteps]);

  const [rowProgress, setRowProgress] = useState<{ h: number; v: number }[]>([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const viewportH = window.innerHeight;
          const next = rows.map((_, idx) => {
            const el = rowRefs.current[idx];
            if (!el) return { h: 0, v: 0 };
            const rect = el.getBoundingClientRect();
            // Start moving across when row top is at 74% of viewport, finish by 38%
            const startH = viewportH * 0.74;
            const endH = viewportH * 0.38;
            const rawH = (startH - rect.top) / (startH - endH);
            const h = Math.max(0, Math.min(1, rawH));

            // Move down connector when row top is between 38% and 15%
            const startV = viewportH * 0.38;
            const endV = viewportH * 0.15;
            const rawV = (startV - rect.top) / (startV - endV);
            const v = Math.max(0, Math.min(1, rawV));

            return { h, v };
          });

          setRowProgress(next);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [rows]);

  return (
    <>
      <Seo
        title="Our Process | My Rare Aesthetics"
        description="Follow the seven-phase My Rare Aesthetics journey from vision and formulation to commercial product launch."
      />
      {/* Hero — interactive Lumina WebGL shader showcase (compact / decreased size) */}
      <section className="relative h-[60svh] min-h-[460px] max-h-[600px] overflow-hidden bg-[#0a0a0a]">
        <LuminaInteractiveList
          slides={slides}
          compact
          autoSlide={slides.length > 1}
          showNavigation={false}
          showCounter={slides.length > 1}
        />
      </section>

      {/* 7-Stage Process Framework with Two Cards per Row & Animated Cream Line */}
      <Section className="bg-atmosphere overflow-hidden">
        <Reveal>
          <SectionHeading
            eyebrow={processData.eyebrow || 'Our Approach'}
            title={processData.title || 'The Pathway to Beauty Innovation'}
            description={
              processData.description ||
              'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.'
            }
            align="center"
          />
        </Reveal>

        <div className="mt-14 space-y-12">
          {rows.map((row, rowIndex) => {
            const hProg = rowProgress[rowIndex]?.h ?? 0;
            const vProg = rowProgress[rowIndex]?.v ?? 0;
            const nextHProg = rowProgress[rowIndex + 1]?.h ?? 0;

            // Show horizontal cream droplet if currently moving or resting at end of last row
            const showHorizontalDroplet =
              (hProg > 0.02 && (hProg < 0.98 || vProg < 0.05)) ||
              (rowIndex === rows.length - 1 && hProg >= 0.98);

            // Show vertical cream droplet if currently descending to next row
            const showVerticalDroplet =
              rowIndex < rows.length - 1 &&
              hProg >= 0.95 &&
              vProg > 0.02 &&
              nextHProg < 0.08;

            return (
              <div
                key={row.left.step}
                ref={(el) => {
                  rowRefs.current[rowIndex] = el;
                }}
                className="relative"
              >
                {/* Horizontal Connecting Arrow Line on Desktop with Moving Cream Droplet */}
                <div className="hidden md:flex absolute top-7 left-7 right-7 items-center z-0">
                  {/* Background track line */}
                  <div className="relative w-full h-1 bg-plum/20 rounded-full overflow-visible">
                    {/* Active cream line fill */}
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orchid/80 via-white to-orchid rounded-full shadow-[0_0_10px_#d5b2dd] transition-all duration-75 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, hProg * 100))}%` }}
                    />
                  </div>
                  <ArrowRight className="h-5 w-5 text-plum shrink-0 -ml-2" />

                  {/* Cosmetic Cream Droplet moving along the line */}
                  {showHorizontalDroplet && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75 ease-out"
                      style={{ left: `${Math.min(100, Math.max(0, hProg * 100))}%` }}
                    >
                      <CreamDroplet />
                    </div>
                  )}
                </div>

                {/* Two Cards per Row Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                  {/* Left Card */}
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span
                        className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold shadow-md ring-4 ring-white transition-all duration-500 hover:scale-105 ${
                          hProg > 0.05
                            ? 'bg-plum text-lavender shadow-[0_0_15px_rgba(213,178,221,0.6)]'
                            : 'bg-plum text-lavender'
                        }`}
                      >
                        {row.left.step}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-1 flex-col justify-between rounded-sm border border-plum/15 bg-white/85 p-7 md:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-plum/35 hover:bg-white hover:shadow-lg">
                      <div>
                        <span className="font-alt text-[11px] font-semibold uppercase tracking-[0.22em] text-deep-blue">
                          {row.left.tag || `Phase ${row.left.step}`}
                        </span>
                        <h3 className="mt-2.5 font-heading text-2xl font-medium leading-snug text-plum">
                          {row.left.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-dark-plum/75 md:text-base">
                          {row.left.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-plum/60">
                        <span>{row.left.proceedText || `Proceed to phase ${row.right.step}`}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile downward connecting arrow between left and right cards */}
                  <div className="md:hidden relative flex justify-center py-2">
                    <div className="relative flex flex-col items-center">
                      <div className="h-8 w-1 bg-plum/20 rounded-full overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-b from-orchid via-white to-orchid"
                          style={{ height: `${Math.min(100, Math.max(0, hProg * 100))}%` }}
                        />
                      </div>
                      <ArrowDown className="h-4 w-4 text-plum mt-1" />
                      {hProg > 0.05 && hProg < 0.95 && (
                        <div
                          className="absolute -translate-x-1/2 left-1/2"
                          style={{ top: `${hProg * 32}px` }}
                        >
                          <CreamDroplet className="scale-75" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Card */}
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span
                        className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold shadow-md ring-4 ring-white transition-all duration-500 hover:scale-105 ${
                          hProg >= 0.95
                            ? 'bg-plum text-lavender shadow-[0_0_15px_rgba(213,178,221,0.6)]'
                            : 'bg-plum text-lavender'
                        }`}
                      >
                        {row.right.step}
                      </span>
                    </div>

                    <div
                      className={`mt-6 flex flex-1 flex-col justify-between rounded-sm border p-7 md:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg ${
                        row.right.isAction
                          ? 'border-orchid/50 bg-gradient-to-br from-white via-white to-orchid/25'
                          : 'border-plum/15 bg-white/85 hover:border-plum/35 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-alt text-[11px] font-semibold uppercase tracking-[0.22em] text-deep-blue">
                          {row.right.tag ||
                            (row.right.isAction ? 'Next Step · Engagement' : `Phase ${row.right.step}`)}
                        </span>
                        <h3 className="mt-2.5 font-heading text-2xl font-medium leading-snug text-plum">
                          {row.right.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-dark-plum/75 md:text-base">
                          {row.right.description}
                        </p>
                      </div>

                      {row.right.isAction ? (
                        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-plum/10 pt-6">
                          <Button to={row.right.actionUrl || '/contact'}>
                            {row.right.actionText || 'Book a Consultation'}
                          </Button>
                          <Button
                            to={row.right.secondaryActionUrl || '/contact'}
                            variant="outline"
                          >
                            {row.right.secondaryActionText || 'Start a Conversation'}
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-plum/60">
                          <span>
                            {row.right.proceedText ||
                              `Proceed to phase ${String(Number(row.right.step) + 1).padStart(2, '0')}`}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continuous physical S-curve connecting line from row to row on desktop */}
                {rowIndex < rows.length - 1 && (
                  <RowConnector vProg={vProg} isActive={showVerticalDroplet} />
                )}

                {/* Downward connecting line on mobile */}
                {rowIndex < rows.length - 1 && (
                  <div className="md:hidden relative flex justify-center py-4">
                    <div className="relative flex flex-col items-center text-plum/60">
                      <div className="h-8 w-1 bg-plum/20 rounded-full overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-b from-orchid via-white to-orchid"
                          style={{ height: `${Math.min(100, Math.max(0, vProg * 100))}%` }}
                        />
                      </div>
                      <ArrowDown className="h-4 w-4 text-plum mt-1" />
                      {vProg > 0.05 && vProg < 0.95 && (
                        <div
                          className="absolute -translate-x-1/2 left-1/2"
                          style={{ top: `${vProg * 32}px` }}
                        >
                          <CreamDroplet className="scale-75" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
