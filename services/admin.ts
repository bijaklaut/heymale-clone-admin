import { PUBLIC_API_BASEURL, PUBLIC_API_VER } from "../constants";
import callApi from "./callApi";
import {
  CartItemTypes,
  PostOrderTypes,
  PostPaymentTypes,
  SignInTypes,
} from "./types";

// Category Dashboard
export const getCategories = async (search?: string, page?: number) => {
  const searchQuery = search ? `?search=${search}` : "";
  const pageQuery = page ? (searchQuery ? `&p=${page}` : `?p=${page}`) : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/category${searchQuery}${pageQuery}`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createCategory = async (
  data: { name: string },
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/category/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateCategory = async (
  data: { name: string },
  id: string,
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/category/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteCategory = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/category/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};

// End of Category Dashboard

// Payment Dashboard
export const getPayments = async (search: string, page?: number) => {
  const searchQuery = `?search=${search}` || "";
  const pageQuery = page ? (searchQuery ? `&p=${page}` : `?p=${page}`) : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/payment${searchQuery}${pageQuery}`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createPayment = async (data: PostPaymentTypes, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/payment/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updatePayment = async (
  data: PostPaymentTypes,
  id: string,
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/payment/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deletePayment = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/payment/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};

// End of Payment Dashboard

// Product Dashboard
export const getProducts = async (
  page?: number,
  data?: { query: string; search: string },
) => {
  const queryString = page ? `?p=${page}` : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/product${queryString}`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const createProduct = async (data: FormData, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/product/create`;
  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateProduct = async (
  data: FormData,
  id: string,
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/product/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteProduct = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/product/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of Product Dashboard

// User Dashboard
export const getUsers = async (page: number, search: string) => {
  const searchQuery = search ? `?search=${search}` : "";
  const pageQuery = page ? (searchQuery ? `&p=${page}` : `?p=${page}`) : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user${searchQuery}${pageQuery}`;

  return callApi({
    url,
    method: "GET",
  });
};

export const getUserById = async (id: string) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/${id}`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createUser = async (data: FormData, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateUser = async (
  data: FormData,
  id: string,
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteUser = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of User Dashboard

// Address
export const createAddress = async (data: FormData, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/address/create`;

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
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/address/update/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteAddress = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/address/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};

export const getAddressByUser = async (user: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/address/byuser`;

  return callApi({
    url,
    data: { user },
    method: "POST",
    token,
  });
};
// End of Address

// Voucher
export const getVouchers = async (page?: number) => {
  const pageQuery = page ? `?p=${page}` : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/voucher${pageQuery}`;

  return callApi({
    url,
    method: "POST",
  });
};

export const getAvailableVouchers = async () => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/voucher/available`;

  return callApi({
    url,
    method: "GET",
  });
};

export const createVoucher = async (data: FormData, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/voucher/create`;

  return callApi({
    url,
    method: "POST",
    data,
    token,
  });
};

export const updateVoucher = async (data: FormData, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/voucher/update`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};

export const deleteVoucher = async (id: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/voucher/${id}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of Voucher

// Order
export const getOrders = async (
  page?: number,
  data?: { filter: string; search: string },
) => {
  const pageQuery = page ? `?p=${page}` : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/order${pageQuery}`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const createOrder = async (data: PostOrderTypes, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/order/create`;

  return callApi({
    url,
    data,
    method: "POST",
    token,
  });
};

export const getOrderDetail = async (invoice: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/order/${invoice}`;

  return callApi({
    url,
    method: "GET",
    token,
  });
};

export const createShippingOrder = async (data: { invoice: string }) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/order/shipping`;

  return callApi({
    url,
    data,
    method: "POST",
  });
};
// End of Order

// Shipment
export const getShipments = async (page?: number) => {
  const pageQuery = page ? `?p=${page}` : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/shipment${pageQuery}`;

  return callApi({
    url,
    method: "POST",
  });
};
// End of Shipment

// Transaction
export const getTransactions = async (page?: number) => {
  const pageQuery = page ? `?p=${page}` : "";
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/transaction${pageQuery}`;

  return callApi({
    url,
    method: "POST",
  });
};
// End of Transaction

// Cart
export const updateCart = async (data: {
  user: string;
  items: CartItemTypes[];
}) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/cart/updatecart`;

  return callApi({
    url,
    data,
    method: "POST",
  });
};

export const getUserCart = async (data: { user: string }) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/cart/usercart`;

  return callApi({
    url,
    data,
    method: "POST",
  });
};

export const emptyCart = async (user: string, token: boolean) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/cart/${user}?_method=DELETE`;

  return callApi({
    url,
    method: "POST",
    token,
  });
};
// End of Cart

// Auth
export const signIn = async (data: SignInTypes) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/signin`;

  return callApi({
    url,
    method: "POST",
    data,
  });
};

export const changePassword = async (
  data: FormData,
  id: string,
  token: boolean,
) => {
  const url = `${PUBLIC_API_BASEURL}/${PUBLIC_API_VER}/user/reauth/${id}`;

  return callApi({
    url,
    method: "PUT",
    data,
    token,
  });
};
// End of Auth
