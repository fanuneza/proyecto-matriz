type Props = { size?: number };

export function Logo({ size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <g fill="var(--accent)">
        <rect x="2" y="11" width="4" height="10" rx="2" />
        <rect x="8" y="7" width="4" height="18" rx="2" />
        <rect x="14" y="3" width="4" height="26" rx="2" />
        <rect x="20" y="7" width="4" height="18" rx="2" />
        <rect x="26" y="11" width="4" height="10" rx="2" />
      </g>
    </svg>
  );
}
