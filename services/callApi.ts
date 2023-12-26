import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

interface CallAPIProps extends AxiosRequestConfig {
  token?: string;
  serverToken?: string;
}

const callApi = async ({
  url,
  method,
  data,
  token = "",
  serverToken,
}: CallAPIProps) => {
  let headers = {};
  if (token) {
    const jwt = Buffer.from(token, "base64").toString("ascii");
    headers = {
      authorization: `Bearer ${jwt}`,
    };
  }

  try {
    const response = await axios({ url, method, data, headers });

    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export default callApi;
