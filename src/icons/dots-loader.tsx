import { SVGProps } from "react";

export function DotsLoaderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill="currentColor"
        d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m14 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"
      ></path>
      <path
        fill="currentColor"
        d="M14 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0"
        opacity=".5"
      ></path>
    </svg>
  );
}
