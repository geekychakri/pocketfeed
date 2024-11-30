import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkIfObjectIsEmpty(obj: Object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isHttpValid(str: string) {
  try {
    const newUrl = new URL(str);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

export function relativeTime() {}

export function extractTimestampTags(
  htmlString: string,
): { timestamp: string; text: string }[] {
  // Parse the HTML string into a DOM object
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Define regex for matching timestamps in specified formats
  const timestampRegex = /\(?(\d{1,2}:\d{2}:\d{2})\)?|\(?(\d{1,2}:\d{2})\)?/g;

  // Initialize an array to hold results
  let results: { timestamp: string; text: string }[] = [];

  // Function to traverse text nodes
  function traverseNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent ?? "";
      let match;
      while ((match = timestampRegex.exec(textContent)) !== null) {
        // Store result as an object with timestamp and corresponding text
        console.log({ match });
        console.log({ textContent });
        results.push({ timestamp: match[0], text: textContent.trim() });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(traverseNodes);
    }
  }

  // Start traversing from the body of the parsed document
  traverseNodes(doc.body);

  return results;
}

// export function extractTimestampTags(htmlString) {
//   const timestamps = [];

//   const parser = new DOMParser();
//   // Parse the HTML string into a document
//   const doc = parser.parseFromString(htmlString, "text/html");
//   const listItems = doc.body.querySelectorAll("*");

//   listItems.forEach((item) => {
//     const text = item.innerText;
//     const regex = /(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})\s+(.*)/; // Matches hh:mm:ss or mm:ss followed by text
//     const match = text.match(regex);

//     if (match) {
//       timestamps.push({
//         timestamp: match[1],
//         text: match[2],
//       });
//     }
//   });

//   return timestamps;
// }
