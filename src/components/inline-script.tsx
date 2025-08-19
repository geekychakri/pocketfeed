"use client";

import Script from "next/script";

export default function InlineScript() {
  return (
    <Script
      strategy="lazyOnload"
      id="hhh"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${(() => {
          const dummyDataEle = document.getElementById(
            "dummy-data",
          ) as HTMLDivElement;
          // window.__INITIAL_TEXT__ = Date.now();
          // const time = new Date(window.__INITIAL_TEXT__);

          // // Use the same logic as in the Clock component
          // const secondRotation =
          //   time.getSeconds() * 6 + time.getMilliseconds() * 0.006;
          document.querySelectorAll("pre").forEach((pre) => {
            const p = document.createElement("p");
            p.innerText = "Child node";
            pre.appendChild(p);
          });

          alert("hello");
          // dummyDataEle.setAttribute("data-attr", secondRotation.toString());
        }).toString()})()`,
      }}
    />
  );
}
