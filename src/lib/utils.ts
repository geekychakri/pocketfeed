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

function relativeTime() {}

function cleanUrl(url: string) {
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

  const splitArr = name.split("");

  if (splitArr.length > 2) {
    return splitArr[0].at(0);
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

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

function extractTimestampTags(
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

async function checkLinkIsBroken(link: string) {
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

function toastError(message: string, duration = 3000) {
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

function signUrl(url: string) {
  const sig = crypto.createHmac("sha256", secret).update(url).digest("hex");
  return `${url}::${sig}`;
}

function verifyUrl(signed: string) {
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

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language,
): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function humanReadableDate(date: string, lang = navigator.language) {
  const d = new Date(date).toLocaleString(lang, {
    dateStyle: "medium",
    // timeStyle: "short",
  });

  const t = new Date(date).toLocaleString(lang, {
    timeStyle: "short",
  });

  return `${d} · ${t}`;
}
