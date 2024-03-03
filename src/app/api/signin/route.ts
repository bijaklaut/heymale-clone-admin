import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  API_BASEURL,
  API_VER,
  EXPIRED_ACCESS,
  EXPIRED_REFRESH,
} from "../../../../constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { headers, data } = await axios({
      url: `${API_BASEURL}/${API_VER}/user/signin`,
      method: "POST",
      data: body,
    });

    const getCookie = headers["set-cookie"];
    let cleanedCookies: any[] = [];

    if (!getCookie) {
      throw data;
    }

    getCookie.forEach((cookie) => {
      let transformed = cookie.split("; ");
      cleanedCookies.push(transformed);
    });

    cleanedCookies.forEach((baked: string, index) => {
      cleanedCookies[index] = baked[0].split("=")[1];
    });

    const [newAccessToken, refreshToken] = cleanedCookies;

    const accessEncoded = Buffer.from(newAccessToken, "ascii").toString(
      "base64",
    );

    const refreshEncoded = Buffer.from(refreshToken, "ascii").toString(
      "base64",
    );

    cookies().set("accessToken", accessEncoded, {
      httpOnly: true,
      maxAge: EXPIRED_ACCESS,
      sameSite: "strict",
    });

    cookies().set("refreshToken", refreshEncoded, {
      httpOnly: true,
      maxAge: EXPIRED_REFRESH,
      sameSite: "strict",
    });

    return NextResponse.json({
      message: data.message,
      status: data.status,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, status: error.status });
  }
}
