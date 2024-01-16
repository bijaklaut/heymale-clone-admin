import { Dispatch, SetStateAction } from "react";

export interface PaginationTypes {
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ValidationTypes {
  field: string;
  message: string;
}

export interface SetStateTypes {
  setData: Dispatch<SetStateAction<any>>;
  setValidation: Dispatch<SetStateAction<ValidationTypes[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setDisable: Dispatch<SetStateAction<boolean>>;
}

export type InitData = (data?: DataTypes) => any;

export type DataTypes =
  | CategoryTypes
  | AddressTypes
  | PaymentTypes
  | ProductTypes
  | UserTypes;

export type PostDataTypes =
  | PostCategoryTypes
  | PostAddressTypes
  | PostPaymentTypes
  | PostProductTypes
  | PostUserTypes
  | SignInTypes;

export interface LoginTypes {
  email: string;
  password: string;
}

export interface PostCategoryTypes {
  name: string;
}

export interface CategoryTypes extends PostCategoryTypes {
  _id: string;
}

export interface PostPaymentTypes {
  ownerName: string;
  bankName: string;
  accountNo: string;
}
export interface PaymentTypes extends PostPaymentTypes {
  _id: string;
}

export interface VariantTypes {
  s: number;
  m: number;
  l: number;
  xl: number;
}

export enum StatusEnum {
  Active,
  Inactive,
}

export interface PostProductTypes {
  name: string;
  category: string;
  variant: VariantTypes;
  price: number;
  description: string;
  thumbnail?: Blob | string;
  status: string;
}

export interface ProductTypes
  extends Omit<PostProductTypes, "category" | "thumbnail"> {
  _id: string;
  category: CategoryTypes;
  thumbnail: string;
}

export interface PostAddressTypes {
  addressLabel: string;
  recipientName: string;
  address: string;
  province: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
  postcode: string;
  phone: string;
  asDefault: boolean;
  user: string;
}

export interface AddressTypes extends PostAddressTypes {
  _id: string;
}

export interface PostUserTypes {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role?: string;
  avatar?: Blob | string;
  status?: string;
}

export interface UserTypes extends Omit<PostUserTypes, "avatar"> {
  _id: string;
  avatar: string;
  addresses: AddressTypes[];
}

export interface SignInTypes {
  email: string;
  password: string;
}

export interface UserToken {
  id: string;
}

export interface FilterTypes {
  name: string;
  include: boolean;
}
