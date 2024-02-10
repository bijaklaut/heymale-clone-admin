"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { UserToken } from "./types";
import axios from "axios";

const BITESHIP = process.env.BITESHIP_BASEURL;
const BTS_APIKEY = process.env.BITESHIP_APIKEY;

export async function authSignout() {
  cookies().delete("token");
  redirect("/signin");
}

export async function getUserToken() {
  const token = cookies().get("token")?.value;
  const jwt = Buffer.from(token!, "base64").toString("ascii");
  const { id } = jwtDecode<UserToken>(jwt);

  return id;
}

export const getArea = async (input: string) => {
  const url = `${BITESHIP}/v1/maps/areas?countries=ID&input=${input}&type=single`;
  const response = await axios({
    url,
    method: "GET",
    headers: { Authorization: `Bearer ${BTS_APIKEY}` },
  });

  return response.data;
};
