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

export function cleanUrl(url: string) {
  // Remove http://, https://, or www.
  let cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Remove trailing slash if pathname is empty
  if (cleanedUrl.endsWith("/")) {
    cleanedUrl = cleanedUrl.slice(0, -1);
  }

  return cleanedUrl;
}

export function getInitials(name: string) {
  if (!name) {
    return "";
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

// export function convertTextToLinks(text: string) {
//   // // Regex to match URLs with or without scheme (http/https/ftp) and naked domains
//   const urlRegex =
//     /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?=\s|$)/g;

//   return text.replace(urlRegex, (url) => {
//     let formattedUrl = url;

//     // If the URL doesn't have a scheme (http:// or https://), prepend http://
//     if (!/^https?:\/\//i.test(url)) {
//       // If it starts with "www", prepend "http://"
//       if (url.startsWith("www.")) {
//         formattedUrl = `https://${url}`;
//       } else {
//         // For naked domains, prepend "http://"
//         formattedUrl = `https://${url}`;
//       }
//     }

//     // Remove trailing slash if there's no pathname
//     const parsedUrl = new URL(formattedUrl);

//     // Only remove the trailing slash if there's no pathname
//     if (!parsedUrl.pathname && parsedUrl.href.endsWith("/")) {
//       formattedUrl = formattedUrl.replace(/\/$/, ""); // Remove trailing slash
//     }

//     // Remove the prefix (http://, https://, or www.) from the text
//     const displayText = url.replace(/^(https?:\/\/|www\.)/i, "");

//     // Return the <a> tag with the formatted full URL in the href, but show the stripped version
//     return `<a href="${formattedUrl}" target="_blank">${displayText}</a>`;
//   });
// }

export function convertTextToLinks(text: string) {
  // // Regex to match URLs with or without scheme (http/https/ftp) and naked domains
  const urlRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?=\s|$)/g;

  return text.replace(urlRegex, (url) => {
    let formattedUrl = url;

    // If the URL doesn't have a scheme (http:// or https://), prepend http://
    if (!/^https?:\/\//i.test(url)) {
      // If it starts with "www", prepend "http://"
      if (url.startsWith("www.")) {
        formattedUrl = `https://${url}`;
      } else {
        // For naked domains, prepend "http://"
        formattedUrl = `https://${url}`;
      }
    }

    // Only remove the trailing slash if there's no pathname
    if (formattedUrl.endsWith("/")) {
      formattedUrl = formattedUrl.slice(0, -1); // Remove trailing slash
    }

    console.log(formattedUrl);

    // Remove the prefix (http://, https://, or www.) from the text
    const displayText = formattedUrl.replace(/^(https?:\/\/(?:www\.)?)/i, "");

    // Return the <a> tag with the formatted full URL in the href, but show the stripped version
    return `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
  });
}

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
