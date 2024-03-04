"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createVoucher,
  getCategories,
  getProducts,
  getUserCart,
  updateCart,
  updateVoucher,
} from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CartItemTypes,
  CartTypes,
  CategoryTypes,
  OrderTypes,
  PostOrderTypes,
  PostVoucherTypes,
  ProductTypes,
  ValidationTypes,
  VariantTypes,
  VoucherTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import { populateValidation } from "../../../services/helper";
import { ImageSvg } from "../../Misc/SvgGroup";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";
import { ProductThumbnail } from "../../Misc/ProductThumbnail";
import cx from "classnames";
import Image from "next/image";
import { getUserToken } from "../../../services/actions";
import Link from "next/link";
import { PUBLIC_API_IMG } from "../../../constants";

// const initData = () => {
//   return {
//     user: "",
//     orderItems: [
//       { _id: "", item_name: "", thumbnail: "", quantity: 0, price: 0 },
//     ],
//     voucher: {
//       voucher_id: "",
//       value: 0,
//     },
//     shipping: {
//       address: {
//         destination_contact_name: "",
//         destination_contact_phone: "",
//         destination_address: "",
//         destination_province: "",
//         destination_city: "",
//         destination_district: "",
//         destination_postal_code: "",
//         destination_area_id: "",
//         destination_note: "",
//       },
//       courier_company: "",
//       courier_type: "",
//       price: 0,
//     },
//     payment: {
//       payment_type: "",
//       bank: "",
//     },
//   };
// };

interface ThisProps {
  stateChanges(): void;
  order?: OrderTypes;
  isUpdate: boolean;
  reset(): void;
}

const CatalogProductModal = (props: ThisProps) => {
  const { stateChanges, order, isUpdate, reset } = props;
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  // const [data, setData] = useState<PostOrderTypes>(initData());
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [cart, setCart] = useState<CartTypes>();
  const [selected, setSelected] = useState<CartItemTypes>({
    _id: "",
    item_name: "",
    thumbnail: "",
    price: 0,
    weight: 0,
    variants: {
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
    },
  });

  const IMG_URL = useCallback((thumbnail: string) => {
    return thumbnail
      ? `${PUBLIC_API_IMG}/product/${thumbnail}`
      : "icon/image.svg";
  }, []);

  const imageClass = useCallback((thumbnail: boolean) => {
    return cx({
      "w-auto h-[150px] rounded-md shadow-lg border-2 border-neutral/40":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  const modalHandler = useCallback(
    (id: string, show: boolean, updateItem?: VoucherTypes) => {
      const modal = document.getElementById(id) as HTMLDialogElement;
      setDisable(true);

      if (show) {
        // setData(initData());
        return modal.showModal();
      }

      return modal.close();
    },
    [order],
  );

  const getProductsAPI = useCallback(async () => {
    const { payload } = await getProducts();
    setProducts(payload.docs);
  }, [products]);

  const variantSelect = useCallback(
    (element: HTMLInputElement, product: ProductTypes, k: string) => {
      const parentDiv = document.querySelector(`div[id='${product._id}']`);
      const children = parentDiv?.querySelectorAll("div.form-control");

      children?.forEach((child) => {
        const label = child.children[0];
        if (child.id == `${product._id}-${k}`) {
          label.classList.add("bg-black/10");
        } else {
          label.classList.remove("bg-black/10");
        }
      });

      setSelected({
        _id: product._id,
        item_name: product.name,
        thumbnail: product.thumbnail,
        price: product.price,
        weight: 200,
        variants: {
          [k]: 1,
        },
      });
    },
    [],
  );

  const populateCart = useCallback(() => {
    if (!selected) {
      return null;
    }

    const copyItems = cart
      ? (JSON.parse(JSON.stringify(cart?.items)) as CartItemTypes[])
      : [];

    const existProduct = copyItems.findIndex(
      (item: CartItemTypes) => item._id == selected?._id,
    );
    const [label, value] = Object.entries(selected.variants).filter(
      ([k]) => (selected.variants as any)[k] != 0,
    )[0];

    if (existProduct != -1) {
      const updateValue = (copyItems[existProduct].variants as any)[label]
        ? (copyItems[existProduct].variants as any)[label] + value
        : value;

      copyItems[existProduct].variants = {
        ...copyItems[existProduct].variants,
        [label]: updateValue,
      };

      setCart((prev) => ({ ...prev!, items: copyItems }));
    } else {
      copyItems.push(selected);
      setCart((prev) => ({ ...prev!, items: copyItems }));
    }

    return copyItems as CartItemTypes[];
  }, [selected, cart]);

  const storeCart = useCallback(async () => {
    try {
      const newCart = populateCart();
      const user = await getUserToken();
      const { payload } = await updateCart({ user, items: newCart! });
      setCart((prev) => ({
        ...prev!,
        items: payload.items,
      }));
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }, [selected, cart]);

  const directUpdate = useCallback(
    async (item: CartItemTypes, label: string, value: number) => {
      try {
        const copyItems = JSON.parse(
          JSON.stringify(cart?.items),
        ) as CartItemTypes[];
        const itemIndex = copyItems.findIndex((copy) => copy._id == item._id);
        const updateValue =
          (copyItems[itemIndex].variants as any)[label] + value;
        copyItems[itemIndex].variants = {
          ...copyItems[itemIndex].variants,
          [label]: updateValue,
        };

        setCart((prev) => ({ ...prev!, items: copyItems }));

        const user = await getUserToken();
        const result = await updateCart({ user, items: copyItems });
        console.log("update cart: ", result);
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },
    [cart],
  );

  const getCart = useCallback(async () => {
    try {
      const user = await getUserToken();
      const { payload } = await getUserCart({ user });
      if (payload) {
        setCart(payload);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getProductsAPI();
    getCart();
  }, []);

  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm w-fit"
        onClick={() => modalHandler("create_order", true)}
      >
        Catalog
      </button>
      <dialog data-theme={"skies"} id="create_order" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-[700px] text-white">
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title relative text-xl font-medium">
              <span className="absolute left-1/2 -translate-x-[50%]">
                Catalogs
              </span>
            </div>
            <div
              id="card-container"
              className="collapse-content grid grid-cols-2 gap-3"
            >
              {products.length > 0 &&
                products.map((product, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col justify-between rounded-md bg-white p-5 text-neutral"
                  >
                    <div className="mb-5 flex w-full justify-center">
                      <Image
                        src={IMG_URL(product.thumbnail)}
                        width={500}
                        height={500}
                        alt={`thm-${product.name}`}
                        className={imageClass(true)}
                      />
                    </div>
                    <span className="font-semibold">{product.name}</span>
                    <div>
                      <NumFormatWrapper
                        value={product.price}
                        displayType="text"
                        prefix="Rp. "
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </div>
                    <div id={product._id} className="mt-2 flex w-full gap-1">
                      {Object.entries(product.variant).map(([k], i) => (
                        <div
                          id={`${product._id}-${k}`}
                          key={i}
                          className="form-control"
                        >
                          <label className="label h-8 w-8 cursor-pointer rounded-md border-2 border-neutral transition-colors hover:bg-black/10 focus:bg-black/10">
                            <span className="label-text w-full text-center text-neutral">
                              {k.toUpperCase()}
                            </span>
                            <input
                              type="radio"
                              checked={
                                (selected?.variants as any)[k] ? true : false
                              }
                              className="hidden"
                              onChange={(e) =>
                                variantSelect(e.target, product, k)
                              }
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                    {selected?._id == product._id &&
                      Object.entries(selected.variants).map(([k, v], num) => {
                        if (v != 0) {
                          return (
                            <span key={num} className="mt-2 text-sm">
                              Stock: {(product.variant as any)[k]} pcs
                            </span>
                          );
                        }
                      })}

                    <button
                      disabled={selected?._id != product._id}
                      className="btn btn-sm mt-4 text-white disabled:text-black/50"
                      onClick={storeCart}
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-3 flex flex-col rounded-md bg-base-200 p-4">
            <h4 className="modal-title mx-auto mb-5">Cart</h4>
            <div className="grid grid-cols-1 gap-3">
              {cart?.items &&
                cart?.items.map((item) => {
                  return Object.entries(item.variants).map(([k, v], index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-x-3 rounded-md  bg-white p-3"
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
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral">{`${
                            item.item_name
                          } - ${k.toUpperCase()}`}</span>
                          <div className="text-sm text-neutral">
                            <NumFormatWrapper
                              value={item.price}
                              displayType="text"
                              prefix="Rp. "
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </div>
                          <div className="mt-2 grid w-fit grid-cols-3 items-center justify-between justify-items-center overflow-hidden rounded-lg border border-neutral text-center text-neutral">
                            <button
                              className="w-full rounded-lg transition-all hover:bg-black/10 active:bg-black/10"
                              onClick={() => directUpdate(item, k, -1)}
                            >
                              -
                            </button>
                            <div className="w-[35px] bg-red-200">{v}</div>
                            <button
                              className="w-full rounded-lg transition-all hover:bg-black/10 active:bg-black/10"
                              onClick={() => directUpdate(item, k, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
            </div>
          </div>

          {/* Submit */}
          <div className="modal-action flex">
            <Link className="btn btn-primary btn-sm" href={"/checkout"}>
              Checkout
            </Link>
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler("create_order", false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CatalogProductModal;
