import { SVGProps } from "react";

export function UserErrorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE */}
      <path
        fill="currentColor"
        d="M8.5 4a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0m13.879-.536L19.5 8.586l2.121-2.122l1.415 1.415L20.914 10l2.121 2.121l-1.414 1.415l-2.121-2.122l-2.121 2.122l-1.415-1.415L18.087 10l-2.121-2.121zM0 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2h-2v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2H0z"
      ></path>
    </svg>
  );
}
