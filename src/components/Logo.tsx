/** Naka mark: a map pin whose head is a sunrise over the waiting line. */
export default function Logo({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="naka-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--marigold-300)" />
          <stop offset="1" stopColor="var(--marigold-600)" />
        </linearGradient>
      </defs>
      <path d="M24 3C14.6 3 7 10.4 7 19.6 7 31.8 24 45 24 45s17-13.2 17-25.4C41 10.4 33.4 3 24 3z" fill="url(#naka-g)" />
      <circle cx="24" cy="19" r="10.5" fill="var(--color-bg)" />
      <path d="M15.5 21.5a8.5 8.5 0 0 1 17 0z" fill="var(--color-brand)" />
      <path d="M13.5 21.5h21" stroke="var(--color-heading)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 25.2h3.2M22.4 25.2h3.2M27.8 25.2h3.2" stroke="var(--color-heading)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
