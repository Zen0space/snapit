import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function CenterHorizontalIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="4" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function CenterVerticalIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="4" x2="12" y2="10" />
      <line x1="12" y1="14" x2="12" y2="20" />
    </svg>
  );
}

export function CenterBothIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
