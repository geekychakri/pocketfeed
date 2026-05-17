import { srtParser } from "./srt-parser";
import { ParsedResult } from "./types";
import { vttParser } from "./vtt-parser";

export const parse = (raw: string): ParsedResult => {
  return raw.startsWith("WEBVTT") ? vttParser(raw) : srtParser(raw);
};
