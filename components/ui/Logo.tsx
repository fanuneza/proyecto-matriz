type Props = { size?: number };

export function Logo({ size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <line x1="3" y1="7"  x2="21" y2="7"  stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="17" x2="21" y2="17" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
