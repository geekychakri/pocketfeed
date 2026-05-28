import { SVGProps, useState } from "react";

export default function HighlightToolbar({
  position,
  handleCopy,
}: {
  position?: Record<string, number>;
  handleCopy: () => void;
}) {
  const [showSocialShare, setShowSocialShare] = useState(false);
  return (
    <div
      className="border-brand-shadow bg-background-secondary absolute -top-2 left-0 isolate z-1 m-0 flex h-11 w-55 gap-1 rounded-md p-1"
      style={{
        transform: `translate3d(${position?.x}px, ${position?.y}px/article-text, 0)`,
      }}
    >
      <button
        // className="flex w-full h-full justify-between items-center px-2"
        className="hover:bg-ui-hover flex-1 cursor-pointer rounded px-2 text-sm"
        onClick={handleCopy}
      >
        Copy
      </button>

      <a
        className="hover:bg-ui-hover flex flex-1 cursor-pointer items-center justify-center gap-2 rounded bg-none px-2 text-[13px] no-underline"
        href={`https://bsky.app/intent/compose?text=${encodeURIComponent("hello https://github.com/")}`}
        target="__blank"
      >
        <span>Share</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="#888888"
              strokeDasharray="80"
              strokeDashoffset="80"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7.47 5.94c1.83 1.37 3.81 4.14 4.53 5.63c0.72 -1.49 2.7 -4.26 4.53 -5.63c1.33 -0.99 3.47 -1.75 3.47 0.68c0 0.49 -0.28 4.08 -0.45 4.66c-0.57 2.03 -2.65 2.55 -4.5 2.23c3.24 0.55 4.06 2.36 2.28 4.17c-3.38 3.44 -4.85 -0.87 -5.23 -1.97c-0.07 -0.2 -0.1 -0.3 -0.1 -0.22c-0 -0.08 -0.03 0.02 -0.1 0.22c-0.38 1.1 -1.86 5.41 -5.23 1.97c-1.78 -1.81 -0.96 -3.63 2.28 -4.17c-1.85 0.31 -3.93 -0.21 -4.5 -2.23c-0.17 -0.58 -0.45 -4.18 -0.45 -4.66c0 -2.43 2.14 -1.67 3.47 -0.68Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="80;0"
              />
            </path>
          </svg>
        </span>
      </a>
    </div>
  );
}

function HighlightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <g fill="none" stroke="#888888" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 22h16" />
        <path d="m13.888 3.663l.742-.742a3.146 3.146 0 1 1 4.449 4.45l-.742.74m-4.449-4.448s.093 1.576 1.483 2.966s2.966 1.483 2.966 1.483m-4.449-4.45L7.071 10.48c-.462.462-.693.692-.891.947a5.2 5.2 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-.875 2.626m14.08-8.13l-6.817 6.817c-.462.462-.692.692-.947.891q-.451.352-.969.599c-.291.139-.601.242-1.22.448l-2.626.876m0 0l-.641.213a.848.848 0 0 1-1.073-1.073l.213-.641m1.501 1.5l-1.5-1.5" />
      </g>
    </svg>
  );
}

function NotebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <g fill="none">
        <path
          fill="#888888"
          d="m16.557 6.022l-.037-.75zM14.7 6.27l-.2-.723zm-2.178 1l-.376-.65zM7.487 6.06l-.055.748zM9 6.271l-.178.728zm2.465 1.022l-.349.664zm1.042 8.43l.35.663zM15 14.684l-.178-.728zm1.49-.208l.056.748zm-4.997 1.245l-.35.664zM9 14.685l.178-.728zm-1.49-.208l-.056.748zm-.76-1.566V7.497h-1.5v5.414zm12 0V7.45h-1.5v5.46zm-2.23-7.638c-.63.03-1.397.102-2.02.275l.4 1.446c.458-.127 1.09-.193 1.693-.223zm-2.02.275c-.832.23-1.798.752-2.354 1.073l.752 1.299c.55-.32 1.372-.751 2.002-.926zM7.432 6.81c.5.037 1.007.097 1.39.19l.356-1.457c-.505-.123-1.11-.19-1.636-.229zm1.39.19c.726.178 1.682.637 2.294.958l.697-1.328c-.615-.322-1.713-.861-2.635-1.087zm4.035 9.387c.61-.321 1.583-.792 2.321-.972l-.356-1.457c-.935.228-2.054.78-2.664 1.102zm2.321-.972c.377-.092.875-.152 1.368-.189l-.112-1.496c-.52.039-1.114.106-1.612.228zm-3.336-.355c-.61-.322-1.729-.874-2.664-1.102l-.356 1.457c.738.18 1.711.65 2.321.972zm-2.664-1.102c-.498-.122-1.093-.19-1.612-.228l-.112 1.496c.493.037.99.097 1.368.189zm8.072-1.046c0 .405-.34.783-.816.818l.112 1.496c1.186-.088 2.204-1.053 2.204-2.314zm1.5-5.46c0-1.194-.958-2.24-2.23-2.178l.073 1.498c.338-.017.657.263.657.68zm-13.5 5.46c0 1.26 1.018 2.226 2.204 2.314l.112-1.496c-.476-.035-.816-.413-.816-.818zm6.908 2.148a.34.34 0 0 1-.316 0l-.699 1.327a1.84 1.84 0 0 0 1.714 0zm-.012-8.438a.35.35 0 0 1-.333.008l-.697 1.328a1.85 1.85 0 0 0 1.782-.037zm-5.396.876c0-.427.333-.714.682-.688l.11-1.496c-1.294-.095-2.292.962-2.292 2.184z"
        />
        <path
          stroke="#888888"
          strokeWidth="1.5"
          d="M12 7.585V16M2 9c0-3.771 0-5.657 1.172-6.828S6.229 1 10 1h4c3.771 0 5.657 0 6.828 1.172S22 5.229 22 9v4c0 3.771 0 5.657-1.172 6.828S17.771 21 14 21h-4c-3.771 0-5.657 0-6.828-1.172S2 16.771 2 13z"
        />
      </g>
    </svg>
  );
}

function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <g fill="none" stroke="#888888" strokeWidth="1.5">
        <path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z" />
        <path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3" />
      </g>
    </svg>
  );
}
