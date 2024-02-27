"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  AddressTypes,
  CartTypes,
  GetCourierRatesTypes,
  OrderItemTypes,
  PostOrderTypes,
  PricingRatesTypes,
  ShipmentItemTypes,
  VoucherTypes,
} from "../../services/types";
import Image from "next/image";
import cx from "classnames";
import { CircleCheckSvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "./NumFormatWrapper";
import { getCourierRates, getUserToken } from "../../services/actions";
import { getAddressByUser, getAvailableVouchers } from "../../services/admin";
import Cookies from "js-cookie";
import VoucherListModal from "../Misc/VoucherList";

const virtual_accounts = [
  {
    value: "bca",
    text: "BCA Virtual Account",
  },
  {
    value: "bni",
    text: "BNI Virtual Account",
  },
  {
    value: "bri",
    text: "BRI Virtual Account",
  },
  {
    value: "mandiri",
    text: "Mandiri Virtual Account",
  },
  {
    value: "cimb",
    text: "CIMB Virtual Account",
  },
  {
    value: "permata",
    text: "Permata Virtual Account",
  },
];

const CheckoutWrapper = () => {
  const [cart, setCart] = useState<CartTypes>();
  const [data, setData] = useState<PostOrderTypes>();
  const [deliveryItems, setDeliveryItems] = useState<ShipmentItemTypes[]>([]);
  const [rates, setRates] = useState<PricingRatesTypes[]>([]);
  const [vouchers, setVouchers] = useState<VoucherTypes[]>([]);

  const [addresses, setAddresses] = useState<Partial<AddressTypes[]>>();

  const IMG_API = process.env.NEXT_PUBLIC_IMG;
  const IMG_URL = useCallback((thumbnail: string) => {
    return thumbnail ? `${IMG_API}/product/${thumbnail}` : "icon/image.svg";
  }, []);

  const imageClass = useCallback((thumbnail: boolean) => {
    return cx({
      "w-auto h-[100px] rounded-md shadow-lg border-2 border-neutral/40":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  const populateData = useCallback(() => {
    let order_items: OrderItemTypes[] = [];
    let address;
    let total_items = 0;
    let total_weight = 0;
    let total_amount = 0;
    let dlvItems: ShipmentItemTypes[] = [];

    if (cart) {
      cart.items.map((item) => {
        let item_qty = 0;
        Object.entries(item.variants).map(([size, qty]) => {
          let order_item = {
            _id: item._id,
            item_name: `${item.item_name} - ${size.toUpperCase()}`,
            thumbnail: item.thumbnail,
            quantity: qty,
            price: item.price,
            weight: item.weight,
          };
          total_items += qty;
          item_qty += qty;

          order_items.push(order_item);
        });
        let dataDlv = {
          name: item.item_name,
          description: "Clothes",
          value: item.price,
          quantity: item_qty,
          weight: 200,
        };

        dlvItems.push(dataDlv);
        total_weight += item.weight * item_qty;
        total_amount += item.price * item_qty;
      });
    }

    if (addresses) {
      address = addresses.find((item) => item?.asDefault);
    }

    const order_data: PostOrderTypes = {
      user: cart?.user ? cart?.user : "",
      orderItems: order_items ? order_items : [],
      voucher: {
        voucher_id: "",
        value: 0,
      },
      shipping: {
        address: {
          destination_contact_name: address ? address.recipientName : "",
          destination_contact_phone: address ? address.phone : "",
          destination_address: address ? address.address : "",
          destination_province: address ? address.addressArea.province : "",
          destination_city: address ? address.addressArea.city : "",
          destination_district: address ? address.addressArea.district : "",
          destination_postal_code: address
            ? address.addressArea.postalCode
            : "",
          destination_area_id: address ? address.addressArea.areaId : "",
          destination_note: address ? address.addressNote : "",
        },
        courier_company: "jne",
        courier_type: "reg",
        price: 0,
        total_weight: total_weight,
      },
      payment: {
        payment_type: "",
        bank: "",
      },
      total_items: total_items,
      subtotal: total_amount,
      total: total_amount,
    };
    setDeliveryItems(dlvItems);
    setData(order_data);
  }, [cart, addresses]);

  const getVouchersAPI = useCallback(async () => {
    const { payload } = await getAvailableVouchers();
    setVouchers(payload.docs);
  }, []);

  const getItems = useCallback(() => {
    const local = localStorage.getItem("cart");
    setCart(JSON.parse(local!));
  }, []);

  const getAddressAPI = useCallback(async () => {
    const id = await getUserToken();
    const token = Cookies.get("token");
    const { payload } = await getAddressByUser(id, token!);

    if (payload.length > 0) {
      setAddresses(payload);
    }
  }, []);

  const getCourierRatesAPI = useCallback(async () => {
    try {
      if (data?.shipping.address && deliveryItems) {
        const postData: GetCourierRatesTypes = {
          origin_area_id: "IDNP6IDNC149IDND850IDZ13320",
          destination_area_id: data.shipping.address.destination_area_id,
          couriers: "sicepat,jne",
          items: deliveryItems,
        };
        const result = await getCourierRates(postData);
        setRates(result.pricing);
      }
    } catch (error) {
      console.log("Courier Rates Error: ", error);
    }
  }, [data, deliveryItems]);

  const paymentSelect = useCallback((value: string) => {
    if (value != "mandiri") {
      return setData((prev) => ({
        ...prev!,
        payment: {
          payment_type: "bank_transfer",
          bank: value,
        },
      }));
    }

    return setData((prev) => ({
      ...prev!,
      payment: {
        payment_type: "echannel",
      },
    }));
  }, []);

  const applyVoucher = useCallback((voucher: VoucherTypes) => {
    const voucherInput = document.getElementById(
      "voucher_input",
    ) as HTMLInputElement;

    voucherInput.value = voucher.voucherCode;

    setData((prev) => ({
      ...prev!,
      voucher: {
        voucher_id: voucher._id,
        value: voucher.value,
      },
      total: prev?.total! - voucher.value,
    }));
  }, []);

  useEffect(() => {
    getItems();
    getAddressAPI();
    getVouchersAPI();
  }, []);

  useEffect(() => {
    populateData();
  }, [cart, addresses]);

  useEffect(() => {
    let timer = setTimeout(() => {
      getCourierRatesAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, deliveryItems]);

  useEffect(() => {
    console.log("DATA: ", data);
  }, [data]);

  return (
    <Fragment>
      <h2 className="mb-7 text-center text-2xl font-semibold text-white">{`Checkout Page - Simulation`}</h2>
      <div className="grid w-full grid-cols-[minmax(min-content,_0.6fr)_minmax(min-content,_0.4fr)] p-10">
        {/* Left */}
        <div className="grid w-[700px] grid-cols-1 gap-4">
          {/* Shipping Information */}
          <div className="relative rounded-md border p-7">
            <h3 className="mb-3 text-lg font-semibold">Shipping Information</h3>
            <div className="w-fit">
              <h4 className="mb-1 font-semibold">Recipient</h4>
              <div className="">
                <span>{`${data?.shipping.address.destination_contact_name} - ${data?.shipping.address.destination_contact_phone}`}</span>
              </div>
            </div>
            <div className="mt-3 w-fit">
              <h4 className="mb-1 font-semibold">Address</h4>
              <div className="flex flex-col">
                <p>{`${data?.shipping.address.destination_address}`}</p>
                <span>{data?.shipping.address.destination_district}</span>
                <span>{`${data?.shipping.address.destination_province} ${data?.shipping.address.destination_postal_code}`}</span>
                {data?.shipping.address.destination_note ? (
                  <p className="mt-3">
                    <span className="font-semibold">Delivery Note:</span>
                    {` ${data?.shipping.address.destination_note}`}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button className="absolute right-3 top-2 font-semibold underline hover:text-white active:text-white">
              Change
            </button>
          </div>
          <div className="rounded-md border p-7">
            {rates.length > 0 ? (
              <>
                <h3 className="mb-5 text-lg font-semibold">Courier Service</h3>
                <div className="grid grid-cols-1 gap-3">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-5 rounded-md bg-base-200 p-5"
                    >
                      <label className="label w-full cursor-pointer rounded-md p-2 transition-all">
                        <input
                          type="radio"
                          name="shipping"
                          className="peer hidden"
                          onChange={() => {
                            setData((prev) => ({
                              ...prev!,
                              shipping: {
                                ...prev!.shipping,
                                price: rate.price,
                                courier_company: rate.courier_code,
                                courier_type: rate.courier_service_code,
                              },
                              total: prev!.total + rate.price,
                            }));
                          }}
                        />
                        <div className="flex w-full flex-col gap-x-3">
                          <p>{`${rate.courier_name} - ${rate.courier_service_name} (${rate.duration})`}</p>
                          <NumFormatWrapper
                            value={rate.price}
                            displayType="text"
                            prefix="Rp. "
                            thousandSeparator="."
                            decimalSeparator=","
                          />
                        </div>
                        <div className="relative flex h-5 w-5 items-center justify-center rounded-full border peer-checked:[&>*]:scale-100">
                          <CircleCheckSvg className="absolute w-6 scale-0 fill-current transition-all" />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <span className="loading loading-spinner"></span>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="rounded-md border p-7">
            <h3 className="mb-10 text-center text-lg font-semibold">
              Payment Method
            </h3>
            <div className="grid grid-cols-1">
              <h4 className="mb-5 font-semibold">Virtual Account</h4>
              <div className="grid grid-cols-1 gap-3">
                {virtual_accounts.map((va, index) => (
                  <div
                    key={index}
                    className="flex max-h-[80px] items-center gap-5 rounded-md bg-white p-5 text-neutral"
                  >
                    <label className="label w-full cursor-pointer rounded-md p-2 transition-all">
                      <input
                        type="radio"
                        name="va"
                        className="peer hidden"
                        onChange={() => paymentSelect(va.value)}
                      />
                      <div className="flex w-full items-center gap-x-3">
                        <Image
                          src={`/images/logo/${va.value}.png`}
                          width={100}
                          height={100}
                          alt={va.value}
                        />
                        <span>{va.text}</span>
                      </div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-neutral/30 peer-checked:[&>*]:scale-100">
                        <CircleCheckSvg className="absolute w-6 scale-0 fill-current transition-all" />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative w-full">
          <div className="sticky top-6 flex flex-col gap-4">
            {/* Items */}
            <div data-theme="nord" className="flex flex-col rounded-md p-5">
              <h4 className="mb-7 text-center text-lg font-semibold">
                Shopping Cart
              </h4>
              <div className="flex flex-col gap-2">
                {cart?.items.map((item) => {
                  return Object.entries(item.variants).map(([k, v], index) => {
                    return (
                      <div
                        key={index}
                        className="flex h-fit items-center gap-x-3 rounded-md bg-white p-3 shadow-md"
                      >
                        <div>
                          <Image
                            src={IMG_URL(item.thumbnail!)}
                            width={500}
                            height={500}
                            alt={`thm-${item.item_name}`}
                            className={imageClass(true)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="">{item.item_name}</span>
                          <span className="text-xs">{`Variant: ${k.toUpperCase()}`}</span>
                          <div className="text-xs">
                            <NumFormatWrapper
                              value={item.price}
                              displayType="text"
                              prefix="Rp. "
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                            <span>{` x ${v}`}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
            {/* Transaction Detail-Action*/}
            <div
              data-theme="nord"
              className="grid grid-cols-1 gap-2 rounded-md px-7 py-5"
            >
              <div className="mb-2 flex gap-1">
                <input
                  id="voucher_input"
                  type="text"
                  placeholder="Input voucher code here"
                  className="input input-bordered input-sm w-full max-w-xs"
                />
                <button
                  disabled
                  data-theme="skies"
                  className="btn btn-sm text-white disabled:text-black/60"
                >
                  Apply
                </button>
                <VoucherListModal
                  order={data!}
                  applyVoucher={applyVoucher}
                  vouchers={vouchers}
                  cart={cart!}
                />
              </div>
              <div className="grid grid-cols-2">
                <span>{`Subtotal (${data?.total_items || "0"})`}</span>
                <div className="place-self-end">
                  <NumFormatWrapper
                    value={data?.subtotal}
                    displayType="text"
                    prefix="Rp. "
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <span>Shipping Fee</span>
                <div className="place-self-end">
                  {data?.shipping.price ? (
                    <NumFormatWrapper
                      value={data.shipping.price}
                      displayType="text"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              {data?.voucher.value ? (
                <div className="grid grid-cols-2">
                  <span>Discount</span>
                  <div className="place-self-end">
                    <NumFormatWrapper
                      value={data.voucher.value}
                      displayType="text"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="grid grid-cols-2">
                <span className="font-semibold">Total</span>
                <div className="place-self-end">
                  <NumFormatWrapper
                    value={data?.total}
                    displayType="text"
                    prefix="Rp. "
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </div>
              </div>
            </div>
            <button className="btn btn-accent text-white">Confirm Order</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CheckoutWrapper;
