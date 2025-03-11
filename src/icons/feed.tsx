import { SVGProps } from "react";

export function FeedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M13 19a8 8 0 0 0-8-8m14 8c0-7.732-6.268-14-14-14"
        ></path>
        <circle cx="6" cy="18" r="2" fill="currentColor"></circle>
      </g>
    </svg>
  );
}
