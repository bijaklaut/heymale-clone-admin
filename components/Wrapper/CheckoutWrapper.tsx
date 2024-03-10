"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  CircleCheckSvg,
  EditSvg,
  InfoSvg,
  LongArrowLeft,
} from "../Misc/SvgGroup";
import NumFormatWrapper from "./NumFormatWrapper";
import { getCourierRates, getUserId } from "../../services/actions";
import {
  createOrder,
  emptyCart,
  getAddressByUser,
  getAvailableVouchers,
} from "../../services/admin";
import VoucherListModal from "../Misc/VoucherList";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { appendImageURL } from "../../services/helper";
import Link from "next/link";

const CheckoutWrapper = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartTypes>();
  const [data, setData] = useState<PostOrderTypes>();
  const [deliveryItems, setDeliveryItems] = useState<ShipmentItemTypes[]>([]);
  const [rates, setRates] = useState<PricingRatesTypes[]>([]);
  const [vouchers, setVouchers] = useState<VoucherTypes[]>([]);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState<Partial<AddressTypes[]>>();

  const imageClass = useCallback((thumbnail: boolean) => {
    return cx({
      "w-auto h-[100px] rounded-md shadow-lg border-2 border-neutral/40":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  const orderDataCheck = useCallback(() => {
    const complexFields = ["shipping", "payment"];

    if (data) {
      for (let i = 0; i < Object.entries(data).length; i++) {
        const [key] = Object.entries(data)[i];

        if (Array.isArray((data as any)[key])) {
          const newArray: Array<string> = (data as any)[key];

          if (newArray.length == 0) {
            setDisable(true);
            break;
          }
        }

        if (!complexFields.includes(key) && !(data as any)[key]) {
          setDisable(true);
          break;
        }

        if (
          !data.shipping.address.destination_postal_code ||
          !data.shipping.price ||
          !data.payment.payment_type
        ) {
          setDisable(true);
          break;
        }

        setDisable(false);
      }
    }
  }, [data]);

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
      orderItems: cart?.items ? cart.items : [],
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
        courier_company: "",
        courier_type: "",
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

  const getAddressAPI = useCallback(async () => {
    const id = await getUserId();
    const { payload } = await getAddressByUser(id, true);

    if (payload.length > 0) {
      setAddresses(payload);
    }
  }, []);

  const getItems = useCallback(() => {
    const local = localStorage.getItem("cart");
    setCart(JSON.parse(local!));
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
    } catch (error: any) {}
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
      total: prev!.subtotal + prev!.shipping.price - voucher.value,
    }));
  }, []);

  const confirmOrder = useCallback(async () => {
    try {
      if (data && cart?.items.length! > 0) {
        const { status, payload, message } = await createOrder(data, true);
        setLoading(true);

        if (status == 201) {
          const { payload } = await emptyCart(cart!.user, true);
          setCart((prev) => ({ ...prev!, items: payload }));
          setTimeout(() => {
            setLoading(false);
            toast.success(message, { containerId: "Main" });
            router.push(`/order/${payload}`);
          }, 700);
        }
      }
    } catch (error: any) {
      toast.error(
        `Failed to process order. Please try again later (${error.status})`,
        { containerId: "Main" },
      );
    }
  }, [data, cart]);

  // Get cart items, addresses, vouchers exec
  useEffect(() => {
    getItems();
    getAddressAPI();
    getVouchersAPI();
  }, []);

  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Populate Data Exec
  useEffect(() => {
    populateData();
  }, [addresses]);

  // Get Courier Rates Exec
  useEffect(() => {
    let timer = setTimeout(() => {
      getCourierRatesAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, deliveryItems]);

  // Order Data Null Check
  useEffect(() => {
    orderDataCheck();
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-[600px] p-2 md:px-10 md:pb-10 lg:max-w-full 2xl:max-w-[1300px]">
      <div className="mb-10 flex items-center gap-3">
        <button className="rounded-md p-2 transition-all duration-300 hover:bg-black/20 active:bg-black/20">
          <Link href={"/order"}>
            <LongArrowLeft className="h-6 w-6 stroke-white md:h-8 md:w-8" />
          </Link>
        </button>
        <h2 className="text-xl font-semibold text-white md:text-2xl">{`Checkout Page - Simulation`}</h2>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(min-content,_0.55fr)_minmax(min-content,_0.45fr)] xl:grid-cols-[minmax(min-content,_0.6fr)_minmax(min-content,_0.4fr)] xl:gap-x-6">
        {/* Left */}
        <div className="grid w-full grid-cols-1 gap-4">
          {/* Shipping Information */}
          <div className="relative rounded-md border p-5 md:p-7">
            <div className="mb-3 flex items-center justify-between gap-1 text-lg font-semibold">
              <span>Shipping Information</span>
            </div>
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
            <button className="absolute right-3 top-4 rounded-md p-2 transition-all duration-300 hover:bg-black/20 active:bg-black/20">
              <EditSvg className="h-5 w-5 stroke-current" />
            </button>
          </div>
          {/* Courier */}
          <div className="rounded-md border p-5 md:p-7">
            {rates.length > 0 ? (
              <>
                <h3 className="mb-5 text-lg font-semibold">Courier Service</h3>
                <div className="grid grid-cols-1 gap-3">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-5 rounded-md bg-base-200 p-[10px] lg:p-5"
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
                              total:
                                prev!.subtotal +
                                prev!.voucher.value +
                                rate.price,
                            }));
                          }}
                        />
                        <div className="flex w-full flex-col gap-1">
                          <p>{`${rate.courier_name} - ${rate.courier_service_name} (${rate.duration})`}</p>
                          <div className="text-sm">
                            <NumFormatWrapper
                              value={rate.price}
                              displayType="text"
                              prefix="Rp. "
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </div>
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
          <div className="rounded-md border p-5 md:p-7">
            <h3 className="mb-10 text-center text-lg font-semibold">
              Payment Method
            </h3>
            <div className="grid grid-cols-1">
              <h4 className="mb-5 font-semibold">Virtual Account</h4>
              <div className="grid grid-cols-1 gap-3">
                {virtual_accounts.map((va, index) => (
                  <div
                    key={index}
                    className="flex h-[70px] items-center gap-5 rounded-md bg-white p-[10px] text-neutral lg:p-5"
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
                          className="h-auto w-[75px] 2xl:w-[100px]"
                        />
                        <span className="text-sm">{va.text}</span>
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
          <div className="top-6 flex flex-col gap-4 lg:sticky">
            {/* Items */}
            <div
              data-theme="nord"
              className="flex flex-col rounded-md px-[10px] py-5 lg:p-5"
            >
              <h4 className="mb-7 text-center font-semibold lg:text-lg">
                Checkout Items
              </h4>
              <div className="flex max-h-[450px] flex-col gap-2 overflow-y-auto">
                {cart?.items.map((item) => {
                  return Object.entries(item.variants).map(([k, v], index) => {
                    if (v > 0)
                      return (
                        <div
                          key={index}
                          className="flex h-fit items-center gap-x-3 rounded-md bg-white p-3 shadow-md"
                        >
                          <div>
                            <Image
                              src={appendImageURL(item.thumbnail_file)}
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
              <div className="mb-2 grid grid-cols-2 items-center gap-2 max-[500px]:grid-cols-1">
                <input
                  id="voucher_input"
                  type="text"
                  placeholder="Input voucher code"
                  className="input input-bordered input-sm w-full"
                />
                <div className="grid grid-cols-2 gap-2">
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
            <div className="mx-auto flex w-fit max-w-[400px] items-center justify-center gap-3">
              <InfoSvg className="h-8 w-8 stroke-info" />
              <span className="text-xs">
                By purchasing, you agree with to our Terms & Conditions, Refund,
                and Return Policies
              </span>
            </div>
            {!loading ? (
              <button
                className="btn btn-accent mx-auto w-[300px] text-white"
                disabled={disable}
                onClick={confirmOrder}
              >
                Confirm Order
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Confirming..
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default CheckoutWrapper;
