"use client";

export default function Test() {
  // function extractChapters(html) {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(html, "text/html");

  //   const timestampRegex = /(\d{1,2}:)?(\d{1,2}):(\d{2})/;

  //   function extractChapterFromElement(element) {
  //     const text = element.textContent.trim();
  //     const match = text.match(timestampRegex);

  //     if (match) {
  //       const timestamp = match[0];
  //       const title = text.slice(timestamp.length).trim();
  //       return { startTime: timestamp, title: title };
  //     }

  //     return null;
  //   }

  //   const allElements = doc.body.getElementsByTagName("*");
  //   const chapters = Array.from(allElements)
  //     .map(extractChapterFromElement)
  //     .filter((chapter) => chapter !== null);

  //   return chapters;
  // }

  // Sample usage
  const htmlContent = `
  <p class="has-line-data" data-line-start="0" data-line-end="1"> Scott and Wes serve up state management in JavaScript, breaking down key concepts like reactive state, state updaters, and global vs local state. They also explore various approaches and libraries, mutation-based state, and tools like Zustand and xState, to help you manage state like a pro.</p>
  <a id= "Show_Notes_2"></a>Show Notes
  <ul>
    <li class="has-line-data" data-line-start="4" data-line-end="5"> <a href="#t=00:00">00:00</a> Welcome to Syntax!</li>
    <li class="has-line-data" data-line-start="5" data-line-end="6"> <a href="#t=01:22">01:22</a> Brought to you by <a href="https://opensourcepledge.com/">Sentry.io</a>.</li>
    <li class="has-line-data" data-line-start="6" data-line-end="7"> <a href="#t=03:10">03:10</a> What is state?</li>
  </ul>
  `;

  // const chapters = extractChapters(htmlContent);
  // console.log(JSON.stringify(chapters, null, 2));
  const findPodcast = async () => {
    console.log("START");
    // const res = await fetch(``);
    // const data = await res.json();
    // console.log({ data });
  };

  return (
    <div>
      Test
      <button onClick={findPodcast}>Podcast</button>
    </div>
  );
}
