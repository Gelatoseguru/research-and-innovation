   import { NextResponse } from "next/server";

   export function GET(request: Request) {
     return NextResponse.redirect(new URL("/backend/admin/users", request.url), 307);
   }