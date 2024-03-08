import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASEURL, API_VER } from "../../../../constants";

export async function POST(req: NextRequest) {
  try {
    let refreshToken = req.cookies.get("refreshToken")?.value;
    const decodedToken = Buffer.from(refreshToken!, "base64").toString("ascii");
    const headers = new Headers({ Cookie: `refreshToken=${decodedToken}` });
    const result = await fetch(`${API_BASEURL}/${API_VER}/user/signout`, {
      credentials: "include",
      method: "POST",
      headers,
    });

    if (result.status != 200) throw result;

    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    return NextResponse.json({ message: "Signed out", status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to signed out", status: 500 });
  }
}
