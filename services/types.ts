import { Dispatch, SetStateAction } from "react";

export interface PaginationTypes {
  docs: DataTypes[] | [];
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
  | UserTypes
  | OrderTypes
  | ShipmentTypes
  | TransactionTypes;

export type PostDataTypes =
  | PostCategoryTypes
  | PostAddressTypes
  | PostPaymentTypes
  | PostProductTypes
  | PostUserTypes
  | SignInTypes
  | ChangePassTypes;

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
  addressNote: string;
  addressArea: {
    areaId: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
  };
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
  confirm?: string;
  role?: string;
  avatar?: Blob | string;
  status?: string;
}

export interface UserTypes extends Omit<PostUserTypes, "avatar"> {
  _id: string;
  avatar: string;
  addresses: AddressTypes[];
}

export interface PostVoucherTypes {
  _id?: string;
  voucherName: string;
  conditions: string;
  minTransaction: number;
  validProducts: string[];
  validCategories: string[];
  voucherCode: string;
  value: number;
  validUntil: string;
  status: string;
  voucherQuota: number;
}

export interface VoucherTypes
  extends Omit<
    PostVoucherTypes,
    "validUntil" | "validProducts" | "validCategories"
  > {
  _id: string;
  validUntil: string;
  validProducts: ProductTypes[];
  validCategories: CategoryTypes[];
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

export interface ChangePassTypes {
  oldPassword: string;
  newPassword: string;
  confirm: string;
}

export interface AreaDataTypes {
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  country_code: string;
  country_name: string;
  id: string;
  name: string;
  postal_code: string;
}

export interface OrderItemTypes {
  _id: string;
  item_name: string;
  thumbnail: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface ShipmentItemTypes {
  name: string;
  description: string;
  sku?: string;
  value: number;
  quantity: number;
  length?: number;
  width?: number;
  height?: number;
  weight: number;
}

export interface UserOrderTypes {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
}

export interface PostShipmentTypes {
  address: {
    destination_contact_name: string;
    destination_contact_phone: string;
    destination_address: string;
    destination_city: string;
    destination_postal_code: string;
    destination_area_id?: string;
    destination_note: string;
  };
  courier_company: string;
  courier_type: string;
  price: number;
}

export interface ShipmentTypes {
  _id: string;
  shipment_order_id: string;
  shipper: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  origin: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    address: string;
    note: string;
    postal_code: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    province: string;
    city: string;
    district: string;
  };
  destination: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    address: string;
    note: string;
    postal_code: string;
    province: string;
    city: string;
    district: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    proof_of_delivery: {
      use: boolean;
      fee: number;
      note: string;
      link: string;
    };
    cash_on_delivery: {
      id: boolean;
      amount: boolean;
      fee: number;
      note: string;
      link: string;
      type: string;
    };
  };
  courier: {
    tracking_id: string;
    waybill_id: string;
    company: string;
    name: string;
    phone: string;
    type: string;
    link: string;
    insurance: {
      amount: number;
      fee: number;
      note: string;
    };
    routing_code: string;
    history: [
      {
        service_type: string;
        status: string;
        note: string;
        updated_at: string;
      },
    ];
  };
  delivery: {
    datetime: string;
    note: string;
    type: string;
    distance: number;
    distance_unit: string;
  };
  reference_id: string;
  items: Partial<ShipmentItemTypes[]>;
  extra: any;
  price: number;
  metadata: any;
  note: string;
  status: string;
  manual_updated: boolean;
}

export interface TransactionTypes {
  _id: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: number;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers: [
    {
      bank: string;
      va_number: string;
    },
  ];
  fraud_status: string;
  bill_key: string;
  biller_code: string;
  expiry_time: string;
  manual_updated: boolean;
}

export interface OrderTypes {
  _id?: string;
  invoice: string;
  user: Partial<UserTypes>;
  order_item: OrderItemTypes[];
  status: string;
  shipping_detail: Partial<ShipmentTypes>;
  transaction: Partial<TransactionTypes>;
  voucher: Partial<VoucherTypes>;
  shipping_fee: number;
  price: number;
  total_price: number;
  manual_updated: boolean;
}

export interface PostOrderTypes {
  orderItems: CartItemTypes[];
  voucher: {
    voucher_id: string;
    value: number;
  };
  shipping: {
    address: {
      destination_contact_name: string;
      destination_contact_phone: string;
      destination_address: string;
      destination_province: string;
      destination_city: string;
      destination_district: string;
      destination_postal_code: string;
      destination_area_id: string;
      destination_note: string;
    };
    courier_company: string;
    courier_type: string;
    price: number;
    total_weight: number;
  };
  payment: {
    payment_type: string;
    bank?: string;
  };
  subtotal: number;
  total: number;
  total_items: number;
}

export interface OrderTrackingTypes {
  success: boolean;
  messsage: string;
  object: string;
  id: string;
  waybill_id: string;
  courier: {
    company: string;
    name: string;
    phone: string;
  };
  origin: {
    contact_name: string;
    address: string;
  };
  destination: {
    contact_name: string;
    address: string;
  };
  history: [
    {
      note: string;
      service_type: string;
      updated_at: string;
      status: string;
    },
  ];
  link: string;
  order_id: string;
  status: string;
}

export interface CartTypes {
  user: string;
  items: CartItemTypes[];
}

export interface CartItemTypes {
  _id: string;
  item_name: string;
  thumbnail: string;
  price: number;
  variants: Partial<VariantTypes>;
  weight: number;
}

export interface GetCourierRatesTypes {
  origin_area_id: string;
  destination_area_id: string;
  couriers: string;
  items: ShipmentItemTypes[];
}

export interface PricingRatesTypes {
  available_collection_method: string[];
  available_for_cash_on_delivery: boolean;
  available_for_proof_of_delivery: boolean;
  available_for_instant_waybill_id: boolean;
  available_for_insurance: boolean;
  company: string;
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  service_type: string;
  shipping_type: string;
  price: number;
  type: string;
}
