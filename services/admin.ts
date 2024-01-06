import axios from "axios";
import callApi from "./callApi";
import { PostPaymentTypes, SignInTypes } from "./types";
import Cookies from "js-cookie";

const ROOT_API = process.env.NEXT_PUBLIC_API;
const AREA_API = process.env.NEXT_PUBLIC_AREA_API;
const API_VER = "api/v1";

// Category Dashboard
export const getCategories = async () => {
  const url = `${ROOT_API}/${API_VER}/category`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createCategory = async (data: { name: string }) => {
  const url = `${ROOT_API}/${API_VER}/category/create`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const updateCategory = async (data: { name: string }, id: string) => {
  const url = `${ROOT_API}/${API_VER}/category/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const url = `${ROOT_API}/${API_VER}/category/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
  });
};

// End of Category Dashboard

// Payment Dashboard
export const getPayments = async () => {
  const url = `${ROOT_API}/${API_VER}/payment`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createPayment = async (data: PostPaymentTypes) => {
  const url = `${ROOT_API}/${API_VER}/payment/create`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const updatePayment = async (data: PostPaymentTypes, id: string) => {
  const url = `${ROOT_API}/${API_VER}/payment/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
  });
};

export const deletePayment = async (id: string) => {
  const url = `${ROOT_API}/${API_VER}/payment/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
  });
};

// End of Payment Dashboard

// Product Dashboard
export const getProducts = async (data?: { query: string; search: string }) => {
  const url = `${ROOT_API}/${API_VER}/product`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const createProduct = async (data: FormData) => {
  const url = `${ROOT_API}/${API_VER}/product/create`;
  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const updateProduct = async (data: FormData, id: string) => {
  const url = `${ROOT_API}/${API_VER}/product/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
  });
};

export const deleteProduct = async (id: string) => {
  const url = `${ROOT_API}/${API_VER}/product/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
  });
};
// End of Product Dashboard

// User Dashboard
export const getUser = async (token: string, id?: string) => {
  let url = `${ROOT_API}/${API_VER}/user`;

  if (id) {
    url = `${ROOT_API}/${API_VER}/user/${id}`;
  }

  return callApi({
    url,
    method: "GET",
    token,
  });
};

export const createUser = async (data: FormData, token: string) => {
  const url = `${ROOT_API}/${API_VER}/user/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateUser = async (data: FormData, id: string, token: string) => {
  const url = `${ROOT_API}/${API_VER}/user/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteUser = async (id: string, token: string) => {
  const url = `${ROOT_API}/${API_VER}/user/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of User Dashboard

// Address
export const createAddress = async (data: FormData, token: string) => {
  const url = `${ROOT_API}/${API_VER}/address/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateAddress = async (
  data: FormData,
  id: string,
  token: string,
) => {
  const url = `${ROOT_API}/${API_VER}/address/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteAddress = async (id: string, token: string) => {
  const url = `${ROOT_API}/${API_VER}/address/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of Address

// Auth
export const signIn = async (data: SignInTypes) => {
  const url = `${ROOT_API}/${API_VER}/user/signin`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const changePassword = async (
  data: FormData,
  id: string,
  token: string,
) => {
  const url = `${ROOT_API}/${API_VER}/user/reauth/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};
// End of Auth
