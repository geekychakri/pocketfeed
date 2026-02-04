/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  Lexicons,
  ValidationError,
  type LexiconDoc,
  type ValidationResult,
} from "@atproto/lexicon";

import { is$typed, maybe$typed, type $Typed } from "./util";

export const schemaDict = {
  AppPocketfeedFeedSubscription: {
    lexicon: 1,
    id: "app.pocketfeed.feed.subscription",
    defs: {
      main: {
        type: "record",
        key: "tid",
        record: {
          type: "object",
          required: ["feedUrl", "createdAt"],
          properties: {
            feedUrl: {
              type: "string",
              format: "uri",
              maxLength: 2048,
              description: "URL of RSS/Atom feed.",
            },
            title: {
              type: "string",
              maxLength: 512,
              description: "User-provided or auto-detected feed title",
            },
            favicon: {
              type: "string",
              maxLength: 2048,
              description: "The main website's favicon",
            },
            siteUrl: {
              type: "string",
              format: "uri",
              maxLength: 2048,
              description: "The main website URL associated with the feed",
            },
            folder: {
              type: "string",
              maxLength: 128,
              description: "User-defined category/folder for organization",
            },
            createdAt: {
              type: "string",
              format: "datetime",
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>;
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[];
export const lexicons: Lexicons = new Lexicons(schemas);

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>;
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>;
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === "main" ? id : `${id}#${hash}`}" $type property`,
        ),
      };
}

export const ids = {
  AppPocketfeedFeedSubscription: "app.pocketfeed.feed.subscription",
} as const;
