import crypto from "crypto";
import { createElement } from "react";

import { clsx, type ClassValue } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { number } from "zod";

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

export function getInitials(name: string, type?: string) {
  if (!name) {
    return "";
  }
  if (type === "folder") {
    return name.split(" ").map((word) => word[0])[0];
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

export async function getYTChannelAvatar(channelId: string) {
  try {
    const ytChannelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`,
      {
        referrer:
          process.env.NODE_ENV === "production"
            ? "https://pocket-feed.vercel.app" //TODO:
            : "http://localhost:3000",
      },
    );

    const ytChannelData = await ytChannelResponse.json();
    const ytChannelAvatarUrl =
      ytChannelData.items[0].snippet.thumbnails.default.url;
    console.log(ytChannelAvatarUrl);
    return ytChannelAvatarUrl;
  } catch (err) {
    return null;
  }
}

export const getYoutubeVideoId = (url: string) => {
  try {
    const urlObj = new URL(url);

    // Handle standard YouTube URL format: youtube.com/watch?v=ID
    if (
      urlObj.hostname.includes("youtube.com") &&
      urlObj.pathname === "/watch"
    ) {
      return urlObj.searchParams.get("v");
    }

    // Handle shortened YouTube URL format: youtu.be/ID
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.substring(1);
    }

    return null;
  } catch (e) {
    return null;
  }
};

export async function checkLinkIsBroken(link: string) {
  try {
    const res = await fetch(link, {
      method: "HEAD",
    });
    if (res.status >= 400) {
      throw new Error("Link is broken");
    }
    return { error: false };
  } catch (err) {
    return { error: true };
  }
}

//Catch Block Error Message
type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function getErrorMessage(error: unknown) {
  if (isErrorWithMessage(error)) return error.message;
  return String(error);
}

export function convertTimeStringToReadable(timeString: string) {
  if (!timeString) {
    return null;
  }

  if (!timeString.includes(":")) {
    const hours = Math.floor(+timeString / 3600); // Calculate hours
    const minutes = Math.floor((+timeString % 3600) / 60); // Calculate remaining minutes
    console.log({ hours, minutes });

    if (hours === 0 && minutes === 0) {
      return `${timeString}s`;
    }
    return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  }

  let hours, minutes, seconds;

  if (timeString.split(":").length === 3) {
    [hours, minutes, seconds] = timeString.split(":").map(Number);
  } else {
    hours = 0;
    [minutes, seconds] = timeString.split(":").map(Number);
  }

  console.log({ hours });

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

export function checkObjectIsEmpty(value: object): boolean {
  return Object.keys(value).length === 0 && value.constructor === Object; // 👈 constructor check
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumSignificantDigits: 3,
  }).format(value);
}

export function toastError(message: string, duration = 3000) {
  return toast.error(message, {
    duration,
    style: {
      color: "rgba(var(--danger))",
    },
  });
}

export function internalErrorToast(message: string) {
  const sanitized = DOMPurify.sanitize(message, {
    ADD_ATTR: ["target"],
  });

  toast(
    createElement("div", {
      className: `flex flex-col gap-2 font-medium text-pretty`,
      dangerouslySetInnerHTML: { __html: sanitized },
    }),
    {
      duration: 7000,
    },
  );
}

class StatusError extends Error {
  info: string | undefined;
  status: number | undefined;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const error = new StatusError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

const secret = process.env.URL_SIGN_SECRET!;

export function signUrl(url: string) {
  const sig = crypto.createHmac("sha256", secret).update(url).digest("hex");
  return `${url}::${sig}`;
}

export function verifyUrl(signed: string) {
  const [url, sig] = signed.split("::");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(url)
    .digest("hex");
  if (sig !== expected) throw new Error("Tampered URL");
  return url;
}

export function transformFeedUrltoRkey(feedUrl: string) {
  const url = new URL(feedUrl); //remove url extension e.g .xml and trailing slash from url

  if (url.pathname !== "/") {
    const cleanPath = url.pathname.replace(/\/+$/, ""); // remove trailing /
    const pathname = cleanPath.replace(/\/@?/g, "-"); //removes @ in youtube feed url and replace / with -
    return `${url.hostname.replace(/^www\./, "")}` + pathname;
  } else {
    return `${url.hostname.replace(/^www\./, "")}`;
  }
}
