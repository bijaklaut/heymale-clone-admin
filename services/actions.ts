"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { GetCourierRatesTypes, UserToken } from "./types";
import axios from "axios";
import { BITESHIP_APIKEY, BITESHIP_BASEURL } from "../constants";

export const redirectRoot = async () => redirect("/");

export async function getUserToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  const jwt = Buffer.from(token!, "base64").toString("ascii");
  const { id } = jwtDecode<UserToken>(jwt);
  return id;
}

export const getArea = async (input: string) => {
  const url = `${BITESHIP_BASEURL}/v1/maps/areas?countries=ID&input=${input}&type=single`;
  const response = await axios({
    url,
    method: "GET",
    headers: { Authorization: `Bearer ${BITESHIP_APIKEY}` },
  });

  return response.data;
};

export const getCourierRates = async (data: GetCourierRatesTypes) => {
  const url = `${BITESHIP_BASEURL}/v1/rates/couriers`;
  const response = await axios({
    url,
    method: "POST",
    data,
    headers: { Authorization: `Bearer ${BITESHIP_APIKEY}` },
  });

  return response.data;
};

export const trackOrder = async (id: string) => {
  const url = `${BITESHIP_BASEURL}/v1/trackings/${id}`;
  const response = await axios({
    url,
    method: "GET",
    headers: { Authorization: `Bearer ${BITESHIP_APIKEY}` },
  });

  return response.data;
};
