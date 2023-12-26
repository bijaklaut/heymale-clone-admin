"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  const paths = [
    "/category",
    "/payment",
    "/product",
    "/user",
    "/transaction",
    "/history",
    "/voucher",
  ];

  for (const path of paths) {
    if (
      request.nextUrl.pathname.startsWith(path) ||
      request.nextUrl.pathname.endsWith("/")
    ) {
      let token = request.cookies.get("token")?.value;
      if (token) {
        return NextResponse.next();
      } else {
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url);
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/signin")) {
    let token = request.cookies.get("token")?.value;

    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
}
