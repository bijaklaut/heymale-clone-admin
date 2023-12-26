"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { UserToken } from "./types";
import axios from "axios";

const KING_API = process.env.KING;
const API_KEY = process.env.API_KEY;

export async function authLogout() {
  cookies().delete("token");
  redirect("/signin");
}

export async function getUserToken() {
  const token = cookies().get("token")?.value;
  const jwt = Buffer.from(token!, "base64").toString("ascii");
  const { data } = jwtDecode<UserToken>(jwt);

  return data;
}

export const getProvince = async () => {
  try {
    const url = `${KING_API}/province`;
    const response = await axios({
      url,
      method: "GET",
      headers: { key: API_KEY },
    });

    return response.data;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

export const getCity = async (prov_id: string) => {
  try {
    const url = `${KING_API}/city?province=${prov_id}`;
    const response = await axios({
      url,
      method: "GET",
      headers: { key: API_KEY },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
