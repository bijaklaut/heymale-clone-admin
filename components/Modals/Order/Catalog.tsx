"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCatalogProducts,
  getUserCart,
  updateCart,
} from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import {
  CartItemTypes,
  CartTypes,
  OrderTypes,
  PostCartItemTypes,
  ProductTypes,
} from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";
import cx from "classnames";
import Image from "next/image";
import { getUserId } from "../../../services/actions";
import Link from "next/link";
import { appendImageURL } from "../../../services/helper";

interface ThisProps {
  stateChanges(): void;
  order?: OrderTypes;
  isUpdate: boolean;
  reset(): void;
}

const CatalogProductModal = (props: ThisProps) => {
  const { stateChanges, order, isUpdate, reset } = props;

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [cart, setCart] = useState<CartTypes>();
  // const [localCart, setLocalCart] = useState<LocalCartTypes>();
  const [selected, setSelected] = useState<CartItemTypes>({
    _id: "",
    item_name: "",
    thumbnail: "",
    thumbnail_file: "",
    price: 0,
    weight: 0,
    variants: {
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
    },
  });

  const imageClass = useCallback((thumbnail: boolean) => {
    return cx({
      "w-auto h-[150px] rounded-md shadow-lg border-2 border-neutral/40":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  const modalHandler = useCallback(
    (id: string, show: boolean) => {
      const modal = document.getElementById(id) as HTMLDialogElement;

      if (show) {
        return modal.showModal();
      }

      return modal.close();
    },
    [order],
  );

  const getProductsAPI = useCallback(async () => {
    const { payload } = await getCatalogProducts();

    setProducts(payload.docs);
  }, [products]);

  const variantSelect = useCallback((product: ProductTypes, k: string) => {
    setSelected({
      _id: product._id,
      item_name: product.name,
      thumbnail: product.thumbnail,
      thumbnail_file: product.display!,
      price: product.price,
      weight: product.weight,
      variants: {
        [k]: 1,
      },
    });
  }, []);

  const populateCart = useCallback(() => {
    if (!selected) {
      return null;
    }

    // Copy cart or make new cart
    let postItems: PostCartItemTypes[] = [];
    let copyItems: CartItemTypes[] = [];

    if (cart) {
      cart?.items.forEach((item) => {
        let { thumbnail_file, ...rest } = item;
        postItems.push(rest);
      });

      copyItems = JSON.parse(JSON.stringify(cart?.items));
    }

    // Find if selected product is exist in cart
    const existProduct = postItems.findIndex(
      (item) => item._id == selected?._id,
    );

    // Get which variant and value is selected
    const [label, value] = Object.entries(selected.variants).filter(
      ([k]) => (selected.variants as any)[k] != 0,
    )[0];

    // Existed product conditional
    if (existProduct != -1) {
      // If existed product have selected variant then accumulate it with new value
      // If it doesnt have that variant then just add the new value
      const updateValue = (postItems[existProduct].variants as any)[label]
        ? (postItems[existProduct].variants as any)[label] + value
        : value;

      // Insert the updated value to specific variant
      postItems[existProduct].variants = {
        ...postItems[existProduct].variants,
        [label]: updateValue,
      };

      copyItems[existProduct].variants = {
        ...copyItems[existProduct].variants,
        [label]: updateValue,
      };

      // Insert the copyItems to cart
      setCart((prev) => ({ ...prev!, items: copyItems }));
    } else {
      const { thumbnail_file, ...postSelected } = selected;
      // Just push the selected item to the postItems
      // and then insert it to the cart
      postItems.push(postSelected);
      copyItems.push(selected);

      setCart((prev) => ({ ...prev!, items: copyItems }));
    }

    // return postItems as new cart
    return postItems as PostCartItemTypes[];
  }, [selected, cart]);

  const storeCart = useCallback(async () => {
    try {
      const newCart = populateCart();
      const user = await getUserId();
      const result = await updateCart({ user, items: newCart! });

      if (!result.payload) throw result;

      toast.success(result.message, {
        containerId: "catalog",
        toastId: "update_cart",
        hideProgressBar: true,
      });
    } catch (error: any) {
      await getCart();
      toast.error("Failed to update cart", {
        containerId: "catalog",
        toastId: "update_cart",
        hideProgressBar: true,
      });
    }
  }, [selected, cart]);

  const directUpdate = useCallback(
    async (item: CartItemTypes, label: string, value: number) => {
      try {
        const copyItems = JSON.parse(
          JSON.stringify(cart?.items),
        ) as CartItemTypes[];

        let postItems: PostCartItemTypes[] = [];

        if (cart) {
          cart?.items.forEach((item) => {
            let { thumbnail_file, ...rest } = item;
            postItems.push(rest);
          });
        }

        const itemIndex = postItems.findIndex((post) => post._id == item._id);

        const updateValue =
          (postItems[itemIndex].variants as any)[label] + value;

        postItems[itemIndex].variants = {
          ...postItems[itemIndex].variants,
          [label]: updateValue,
        };

        copyItems[itemIndex].variants = {
          ...copyItems[itemIndex].variants,
          [label]: updateValue,
        };

        setCart((prev) => ({ ...prev!, items: copyItems }));

        const user = await getUserId();
        const result = await updateCart({
          user,
          items: postItems,
        });

        if (!result.payload) throw result;

        toast.success(result.message, {
          containerId: "catalog",
          toastId: "update_cart",
          hideProgressBar: true,
        });
      } catch (error: any) {
        await getCart();
        toast.error("Failed to update cart", {
          containerId: "catalog",
          toastId: "update_cart",
          hideProgressBar: true,
        });
      }
    },
    [cart],
  );

  const removeVariant = useCallback(
    async (item: CartItemTypes, label: string) => {
      try {
        const copyItems = JSON.parse(
          JSON.stringify(cart?.items),
        ) as CartItemTypes[];
        let postItems: PostCartItemTypes[] = [];

        if (cart) {
          cart?.items.forEach((item) => {
            let { thumbnail_file, ...rest } = item;
            postItems.push(rest);
          });
        }

        const itemIndex = copyItems.findIndex((copy) => copy._id == item._id);

        delete (copyItems[itemIndex].variants as any)[label];
        delete (postItems[itemIndex].variants as any)[label];

        if (Object.entries(copyItems[itemIndex].variants).length == 0) {
          copyItems.splice(itemIndex, 1);
          postItems.splice(itemIndex, 1);
        }

        setCart((prev) => ({ ...prev!, items: copyItems }));
        const user = await getUserId();
        const result = await updateCart({
          user,
          items: postItems,
        });

        if (!result.payload) throw result;

        toast.success(result.message, {
          containerId: "catalog",
          toastId: "update_cart",
          hideProgressBar: true,
        });
      } catch (error: any) {
        await getCart();
        toast.error("Failed to update cart", {
          containerId: "catalog",
          toastId: "update_cart",
          hideProgressBar: true,
        });
      }
    },
    [cart],
  );

  const getCart = useCallback(async () => {
    try {
      const user = await getUserId();
      const { payload } = await getUserCart({ user });

      if (payload) {
        setCart(payload);
        // setLocalCart(payload);
      }
    } catch (error) {
      console.log("Cart not found");
    }
  }, []);

  const generateTemporaryImage = useCallback(
    (item_id: string) => {
      const match = products.find((product) => product._id == item_id);

      return match?.display;
    },
    [products],
  );

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
        onClick={() => modalHandler("catalog", true)}
      >
        Catalog
      </button>
      <dialog data-theme={"skies"} id="catalog" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"catalog"}
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
              className="collapse-content grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {products.length > 0 &&
                products.map((product, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col justify-between rounded-md bg-white p-5 text-neutral"
                  >
                    <div className="mb-5 flex w-full justify-center">
                      <Image
                        src={appendImageURL(product.display!)}
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
                          <label className="label h-8 w-8 cursor-pointer rounded-md border-2 border-neutral transition-colors hover:bg-black/10 focus:bg-black/10 has-[input:checked]:bg-black/20">
                            <span className="label-text w-full text-center text-neutral">
                              {k.toUpperCase()}
                            </span>
                            <input
                              type="radio"
                              name="variants"
                              className="hidden"
                              onChange={() => variantSelect(product, k)}
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

          {cart && cart.items.length > 0 && (
            <div className="mt-3 flex flex-col rounded-md bg-base-200 p-4">
              <h4 className="modal-title mx-auto mb-5">Cart</h4>
              <div className="grid grid-cols-1 gap-3">
                {cart.items.map((item) => {
                  return Object.entries(item.variants).map(([k, v], index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-x-3 rounded-md  bg-white p-3"
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
                            {(item.variants as any)[k] > 1 ? (
                              <button
                                className="w-full rounded-lg transition-all hover:bg-black/10 active:bg-black/10"
                                onClick={() => directUpdate(item, k, -1)}
                              >
                                -
                              </button>
                            ) : (
                              <button
                                className="flex h-full w-full items-center justify-center rounded-lg transition-all hover:bg-black/10 active:bg-black/10"
                                onClick={() => removeVariant(item, k)}
                              >
                                <TrashSvg className="h-[18px] w-[18px] stroke-current" />
                              </button>
                            )}

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
          )}

          {/* Submit */}
          <div className="modal-action flex">
            <button
              disabled={cart?.items.length == 0}
              className="btn btn-primary btn-sm"
            >
              <Link href={"/checkout"}>Checkout</Link>
            </button>
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler("catalog", false)}
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
