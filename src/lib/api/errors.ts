import { NextResponse } from "next/server";

import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

import z from "@/lib/zod";

const ErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});

type ErrorResponse = z.infer<typeof ErrorSchema>;

const ErrorCode = z.enum([
  "bad_request",
  "not_found",
  "internal_server_error",
  "unauthorized",
  "forbidden",
  "rate_limit_exceeded",
  "invite_expired",
  "invite_pending",
  "exceeded_limit",
  "conflict",
  "unprocessable_entity",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  invite_pending: 409,
  invite_expired: 410,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

function fromZodError(error: ZodError): ErrorResponse {
  return {
    error: {
      // code: "unprocessable_entity",
      message: generateErrorMessage(error.issues, {
        maxErrors: 1,
        delimiter: {
          component: ": ",
        },
        path: {
          enabled: false,
        },
        code: {
          enabled: false,
        },
        message: {
          enabled: true,
          label: "",
        },
      }),
    },
  };
}

function handleApiError(error: any) {
  if (error instanceof ZodError) {
    console.log(fromZodError(error));
    return {
      ...fromZodError(error),
      status: errorCodeToHttpStatus.unprocessable_entity,
    };
  }

  return {
    error: {
      message: "An internal server error occurred. Please contact pocket-feed.",
    },
    status: errorCodeToHttpStatus.internal_server_error,
  };
}

export function handleAndReturnErrorResponse(
  err: unknown,
  headers?: Record<string, string>,
) {
  const { error, status } = handleApiError(err);
  return new Response(error.message, { headers, status });
}
