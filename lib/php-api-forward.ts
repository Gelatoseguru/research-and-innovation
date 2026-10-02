import "server-only";

import { NextResponse } from "next/server";

/**
 * Compatibility bridge for the old Next API URLs. The active application uses
 * /backend directly; this keeps an accidental request to /api on the same
 * MySQL/PHP implementation instead of the removed MongoDB code.
 */
export function forwardToPhpApi(request: Request, path: string) {
  return NextResponse.redirect(new URL(`/backend/${path}`, request.url), 307);
}
