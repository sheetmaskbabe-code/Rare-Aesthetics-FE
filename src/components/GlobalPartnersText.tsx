const REGIONS = [
  { label: 'North America', code: 'us' },
  { label: 'Europe', code: 'eu' },
  { label: 'Australia', code: 'au' },
  { label: 'The Middle East', code: 'ae' },
  { label: 'Africa', code: 'za' },
] as const;

export const GLOBAL_PARTNERS_PLAIN =
  'We partner with founders and brands across the globe, from North America, Europe, Australia, The Middle East and Africa who want to move from idea to an innovative cosmetic product with clarity and care';

const LEGACY_PARTNER_COPY = [
  'Based in Pretoria, South Africa, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.',
  'Based in Pretoria, Gauteng, South Africa, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.',
  'We partner with founders and brands who want a refined pathway from concept to product — combining research, formulation thinking, evaluation support and practical production coordination.',
];

export function isGlobalPartnersCopy(text?: string | null) {
  if (!text) return true;
  const normalized = text.trim();
  if (normalized === GLOBAL_PARTNERS_PLAIN) return true;
  if (LEGACY_PARTNER_COPY.some((legacy) => normalized === legacy)) return true;
  if (normalized.startsWith('Based in Pretoria')) return true;
  return false;
}

function RegionFlag({ code, label }: { code: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
      <img
        src={`https://flagcdn.com/20x15/${code}.png`}
        srcSet={`https://flagcdn.com/40x30/${code}.png 2x`}
        width={20}
        height={15}
        alt=""
        aria-hidden="true"
        className="inline-block rounded-[2px] shadow-sm"
        loading="lazy"
      />
      <span>{label}</span>
    </span>
  );
}

export function GlobalPartnersText({ className }: { className?: string }) {
  return (
    <p className={className}>
      We partner with founders and brands across the globe, from{' '}
      {REGIONS.map((region, index) => (
        <span key={region.code}>
          {index > 0 && (index === REGIONS.length - 1 ? ' and ' : ', ')}
          <RegionFlag code={region.code} label={region.label} />
        </span>
      ))}{' '}
      who want to move from idea to an innovative cosmetic product with clarity and care.
    </p>
  );
}
