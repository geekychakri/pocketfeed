import { SVGProps } from "react";

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="6" r="4" />
        <ellipse cx="12" cy="17" rx="7" ry="4" />
      </g>
    </svg>
  );
}
