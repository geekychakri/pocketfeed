import { Entry, isEntryFromPartial, ParsedResult } from "./types";
import { isBlank } from "./util";

const TRANSITION_NAMES = {
  HEADER: "HEADER",
  ID: "ID",
  TIME_LINE: "TIME_LINE",
  ID_OR_NOTE_OR_STYLE_OR_REGION: "ID_OR_NOTE_OR_STYLE_OR_REGION",
  STYLE: "STYLE",
  NOTE: "NOTE",
  REGION: "REGION",
  LEGACY_HEADER: "LEGACY_HEADER",
  TEXT: "TEXT",
  MULTI_LINE_TEXT: "MULTI_LINE_TEXT",
  FIN_ENTRY: "FIN_ENTRY",
  FINISH: "FINISH",
} as const;
type TransitionNames = keyof typeof TRANSITION_NAMES;

interface TransitionParams {
  tokens: string[];
  pos: number;
  result: Entry[];
  current: Partial<Entry>;
}

interface TransitionResult {
  next: TransitionNames;
  params: TransitionParams;
}

type Machine = Record<
  TransitionNames,
  (params: TransitionParams) => TransitionResult
> & {
  start: (raw: string) => Entry[];
};

// const timestampToSeconds = (value: string) => {
//   const parts = value.split(":");

//   let hours, minutes, seconds;

//   if (parts.length === 3) {
//     [hours, minutes, seconds] = parts;
//   } else {
//     [minutes, seconds] = parts;
//   }

//   return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
// };

const timestampToSeconds = (value: string) => {
  const normalized = value.trim().replace(",", ".");

  const parts = normalized.split(":");

  let hours = "0";
  let minutes = "0";
  let seconds = "0";

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else {
    [minutes, seconds] = parts;
  }

  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
};

const timestampToMillisecond = (value: string) => {
  let arr = value.split(":");
  let hours, minutes, seconds;
  arr.length === 2
    ? ([minutes, seconds] = arr)
    : ([hours, minutes, seconds] = arr);
  return (
    parseInt(seconds.replace(".", ""), 10) +
    parseInt(minutes, 10) * 60 * 1000 +
    (hours ? parseInt(hours, 10) : 0) * 60 * 60 * 1000
  );
};

const VttMachine: () => Machine = () => ({
  start(raw: string): Entry[] {
    let currentTransition: TransitionNames = TRANSITION_NAMES.HEADER;
    let params: TransitionParams = {
      tokens: raw.split(/\n/),
      pos: 0,
      result: [],
      current: {},
    };
    while (currentTransition !== TRANSITION_NAMES.FINISH) {
      const result = this[currentTransition](params);
      params = result.params;
      currentTransition = result.next;
    }

    return params.result;
  },

  [TRANSITION_NAMES.HEADER](params: TransitionParams): TransitionResult {
    return {
      next: TRANSITION_NAMES.LEGACY_HEADER,
      params: { ...params, pos: params.pos + 1 },
    };
  },

  [TRANSITION_NAMES.LEGACY_HEADER](params: TransitionParams): TransitionResult {
    const { tokens, pos } = params;
    if (tokens.length <= pos) {
      return { next: TRANSITION_NAMES.FINISH, params };
    } else if (tokens[pos].includes(":") && !tokens[pos].includes("-->")) {
      return {
        next: TRANSITION_NAMES.LEGACY_HEADER,
        params: { ...params, pos: pos + 1 },
      };
    } else {
      return { next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION, params };
    }
  },

  [TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION](
    params: TransitionParams,
  ): TransitionResult {
    const { tokens, pos } = params;

    if (tokens.length <= pos) {
      return { next: TRANSITION_NAMES.FINISH, params };
    } else if (isBlank(tokens[pos])) {
      return {
        next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION,
        params: { ...params, pos: pos + 1 },
      };
    } else if (tokens[pos].toUpperCase().includes("NOTE")) {
      return { next: TRANSITION_NAMES.NOTE, params };
    } else if (tokens[pos].toUpperCase().includes("STYLE")) {
      return { next: TRANSITION_NAMES.STYLE, params };
    } else if (tokens[pos].toUpperCase().includes("REGION")) {
      return { next: TRANSITION_NAMES.REGION, params };
    } else {
      return { next: TRANSITION_NAMES.ID, params };
    }
  },

  [TRANSITION_NAMES.STYLE](params: TransitionParams): TransitionResult {
    const { tokens, pos } = params;
    if (isBlank(tokens[pos])) {
      return {
        next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION,
        params: { ...params, pos: pos + 1 },
      };
    }
    return {
      next: TRANSITION_NAMES.STYLE,
      params: { ...params, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.NOTE](params: TransitionParams): TransitionResult {
    const { tokens, pos } = params;
    if (isBlank(tokens[pos])) {
      return {
        next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION,
        params: { ...params, pos: pos + 1 },
      };
    }
    return {
      next: TRANSITION_NAMES.STYLE,
      params: { ...params, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.REGION](params: TransitionParams): TransitionResult {
    const { tokens, pos } = params;
    if (isBlank(tokens[pos])) {
      return {
        next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION,
        params: { ...params, pos: pos + 1 },
      };
    }
    return {
      next: TRANSITION_NAMES.REGION,
      params: { ...params, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.ID](params: TransitionParams): TransitionResult {
    const { tokens, pos, current } = params;
    if (tokens.length <= pos) {
      return { next: TRANSITION_NAMES.FINISH, params };
    }
    if (isBlank(tokens[pos])) {
      return { next: TRANSITION_NAMES.ID, params: { ...params, pos: pos + 1 } };
    }

    const idDoesNotExists = tokens[pos].includes("-->");
    current.id = idDoesNotExists ? "" : tokens[pos];
    return {
      next: TRANSITION_NAMES.TIME_LINE,
      params: {
        ...params,
        current,
        tokens,
        pos: idDoesNotExists ? pos : pos + 1,
      },
    };
  },

  [TRANSITION_NAMES.TIME_LINE](params: TransitionParams): TransitionResult {
    const { tokens, pos, current } = params;

    const timeLine = tokens[pos];
    const [startTime, endTime] = timeLine.split("-->");
    current.startTime = timestampToSeconds(startTime);
    current.endTime = timestampToSeconds(endTime);
    return {
      next: TRANSITION_NAMES.TEXT,
      params: { ...params, current, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.TEXT](params: TransitionParams): TransitionResult {
    const { tokens, pos, current } = params;
    if (tokens.length <= pos) {
      return { next: TRANSITION_NAMES.FINISH, params };
    }
    // current.body = tokens[pos];
    //parse voice tag
    const line = tokens[pos];
    const voiceMatch = line.match(/^<v\s+([^>]+)>(.*)$/);
    if (voiceMatch) {
      current.speaker = voiceMatch[1].trim();
      current.body = voiceMatch[2].trim();
    } else {
      current.body = line;
    }

    return {
      next: TRANSITION_NAMES.MULTI_LINE_TEXT,
      params: { ...params, current, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.MULTI_LINE_TEXT](
    params: TransitionParams,
  ): TransitionResult {
    const { tokens, pos, current } = params;
    if (tokens.length <= pos || isBlank(tokens[pos])) {
      return { next: TRANSITION_NAMES.FIN_ENTRY, params };
    }
    // current.body = `${current.body}\n${tokens[pos]}`;

    //parse voice tag
    const line = tokens[pos];
    const voiceMatch = line.match(/^<v\s+([^>]+)>(.*)$/);
    if (voiceMatch) {
      current.speaker ??= voiceMatch[1].trim();

      current.body = `${current.body}\n${voiceMatch[2].trim()}`;
    } else {
      current.body = `${current.body}\n${line}`;
    }

    return {
      next: TRANSITION_NAMES.MULTI_LINE_TEXT,
      params: { ...params, current, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.FIN_ENTRY](params: TransitionParams): TransitionResult {
    const { pos, current, result } = params;
    if (isEntryFromPartial(current)) {
      result.push(current);
    } else {
      throw new Error(
        `Parsing error current not complete ${JSON.stringify(current)}`,
      );
    }
    return {
      next: TRANSITION_NAMES.ID_OR_NOTE_OR_STYLE_OR_REGION,
      params: { ...params, current: {}, pos: pos + 1 },
    };
  },

  [TRANSITION_NAMES.FINISH](params: TransitionParams): TransitionResult {
    return {
      next: TRANSITION_NAMES.FINISH,
      params,
    };
  },
});

export const vttParser = (raw: string): ParsedResult => {
  return {
    segments: VttMachine().start(raw),
  };
};
