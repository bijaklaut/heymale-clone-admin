"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { API_BASEURL, JWT_SECRET } from "../constants";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  for (const path of paths) {
    if (
      request.nextUrl.pathname.startsWith(path) ||
      request.nextUrl.pathname.endsWith("/")
    ) {
      let refreshToken = request.cookies.get("refreshToken")?.value;
      let accessToken = request.cookies.get("accessToken")?.value;

      if (!refreshToken || (!refreshToken && !accessToken)) {
        url.pathname = "/signin";
        const response = NextResponse.redirect(url);
        response.cookies.delete("refreshToken");
        response.cookies.delete("accessToken");

        return response;
      }

      if (refreshToken && !accessToken) {
        const decodedToken = Buffer.from(refreshToken, "base64").toString(
          "ascii",
        );
        const headers = new Headers({ Cookie: `refreshToken=${decodedToken}` });
        const result = await fetch(`${API_BASEURL}/api/v1/user/refresh`, {
          credentials: "include",
          method: "POST",
          headers,
        });

        const getCookie = result.headers.get("Set-Cookie");
        let cleanedCookies: any[] = [];

        if (!getCookie) {
          url.pathname = "/signin";
          return NextResponse.redirect(url);
        }

        let splitCookies = getCookie?.split("HttpOnly, ");

        splitCookies.forEach((cookie) => {
          let transformed = cookie.split("; ");
          cleanedCookies.push(transformed);
        });

        cleanedCookies.forEach((baked: string, index) => {
          cleanedCookies[index] = baked[0].split("=")[1];
        });

        const [newAccessToken] = cleanedCookies;

        const accessEncoded = Buffer.from(newAccessToken, "ascii").toString(
          "base64",
        );

        const response = NextResponse.next();

        response.cookies.set({
          name: "accessToken",
          value: accessEncoded,
          maxAge: 60 * 1,
          httpOnly: true,
          sameSite: "strict",
        });

        return response;
      }

      if (accessToken) {
        try {
          const decodedToken = Buffer.from(accessToken, "base64").toString(
            "ascii",
          );

          await jwtVerify(decodedToken, new TextEncoder().encode(JWT_SECRET));
          return NextResponse.next();
        } catch (error: any) {
          url.pathname = "/signin";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/signin")) {
    let token = request.cookies.get("accessToken")?.value;

    if (token) {
      try {
        const decodedToken = Buffer.from(token, "base64").toString("ascii");
        const url = request.nextUrl.clone();
        url.pathname = "/";

        await jwtVerify(decodedToken, new TextEncoder().encode(JWT_SECRET));
        return NextResponse.redirect(url);
      } catch (error: any) {
        request.cookies.delete("accessToken");

        return NextResponse.next();
      }
    }
  }
}

const paths = [
  "/category",
  "/payment",
  "/product",
  "/user",
  "/transaction",
  "/history",
  "/voucher",
  "/order",
  "/shipment",
];
