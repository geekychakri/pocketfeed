/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";

import { validate as _validate } from "../../../../lexicons";
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from "../../../../util";

const is$typed = _is$typed,
  validate = _validate;
const id = "app.pocketfeed.feed.subscription";

export interface Main {
  $type: "app.pocketfeed.feed.subscription";
  /** URL of RSS/Atom feed. */
  feedUrl: string;
  /** User-provided or auto-detected feed title */
  title?: string;
  /** The main website's favicon */
  favicon?: string;
  /** The main website URL associated with the feed */
  siteUrl?: string;
  /** User-defined category/folder for organization */
  folder?: string;
  createdAt: string;
  [k: string]: unknown;
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain, true);
}

export {
  type Main as Record,
  isMain as isRecord,
  validateMain as validateRecord,
};
