"use server";
import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

interface CallAPIProps extends AxiosRequestConfig {
  token?: boolean;
}

const callApi = async ({ url, method, data, token = false }: CallAPIProps) => {
  let headers = {};
  if (token) {
    const accessToken = cookies().get("accessToken")?.value;

    if (accessToken) {
      const jwt = Buffer.from(accessToken, "base64").toString("ascii");
      headers = {
        authorization: `Bearer ${jwt}`,
      };
    }
  }

  try {
    const response = await axios({ url, method, data, headers });

    return response.data;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
};

export default callApi;
