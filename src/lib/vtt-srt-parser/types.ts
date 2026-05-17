export interface Entry {
  id: string;
  startTime: number;
  endTime: number;
  body: string;
  speaker?: string;
}

export interface ParsedResult {
  segments: Entry[];
}

export const isEntryFromPartial = (e: Partial<Entry>): e is Entry => {
  return (
    typeof e.id === "string" &&
    typeof e.startTime === "number" &&
    typeof e.endTime === "number" &&
    typeof e.body === "string"
  );
};
