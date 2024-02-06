"use client";

import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import { createUser, getProducts } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  PostUserTypes,
  PostVoucherTypes,
  ProductTypes,
  ValidationTypes,
  VoucherTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import {
  buttonCheck,
  populateValidation,
  productImageUrl,
} from "../../../services/helper";
import TextInput from "../../Form/TextInput";
import NumericInput from "../../Form/NumericInput";
import Image from "next/image";
import { CircleCheckSvg, CrossSvg } from "../../Misc/SvgGroup";
import ProductOption from "./ProductOption";
import ProductDisplay from "./ProductDisplay";
import EntitySelect from "./EntitySelect";

const initData = (voucher?: VoucherTypes) => {
  let productIds: Array<string> = [];
  let categoryIds: Array<string> = [];

  if (voucher) {
    voucher.validProducts.map((product) => productIds.push(product._id));
    voucher.validCategories.map((category) => categoryIds.push(category._id));
  }

  return {
    voucherName: voucher?.voucherName || "",
    voucherCode: voucher?.voucherCode || "",
    conditions: voucher?.conditions || "",
    minTransaction: voucher?.minTransaction || 0,
    validProducts: productIds || [],
    validCategories: categoryIds || [],
    value: voucher?.value || 0,
    validUntil: voucher?.validUntil || "",
    status: voucher?.status || "",
    voucherQuota: voucher?.voucherQuota || 0,
  };
};

interface ThisProps {
  stateChanges(): void;
  voucher?: VoucherTypes;
}

const PostVoucherModal = ({ stateChanges, voucher }: ThisProps) => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostVoucherTypes>(initData());
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>([]);
  const [proSearch, setProSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const btnCheckProps = {
    data,
    setDisable,
  };

  const modalHandler = useCallback(
    (id: string, show: boolean, voucher?: VoucherTypes) => {
      const modal = document.getElementById(id) as HTMLDialogElement;
      setDisable(true);
      setValidation([]);

      voucher ? setData(initData(voucher)) : setData(initData());
      show ? modal.showModal() : modal.close();
    },
    [],
  );

  const getProductsAPI = useCallback(async () => {
    const { payload } = await getProducts();
    setProducts(payload.docs);
    setFilteredProducts(payload.docs);
  }, []);

  const getFilterProducts = useCallback(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(proSearch.toLowerCase()),
    );
  }, [products, proSearch]);

  const selectProduct = useCallback(
    (element: HTMLInputElement) => {
      const parent = element.parentElement;
      const newProducts: Array<string> = JSON.parse(
        JSON.stringify(data.validProducts),
      );

      if (element.checked) {
        parent?.classList.add("bg-primary/80");
        newProducts.push(element.value);
        setData((prev) => ({
          ...prev,
          validProducts: newProducts,
        }));
      } else {
        const arrayIndex = newProducts.indexOf(element.value);
        if (arrayIndex > -1) {
          newProducts.splice(arrayIndex, 1);
        }
        parent?.classList.remove("bg-primary/80");
        setData((prev) => ({
          ...prev,
          validProducts: newProducts,
        }));
      }
    },
    [data],
  );

  const deselectProduct = useCallback(
    (productId: string) => {
      const newProducts: Array<string> = JSON.parse(
        JSON.stringify(data.validProducts),
      );
      const label = document.getElementById(productId)?.children[0];
      const input = label?.children[0] as HTMLInputElement;
      const arrayIndex = newProducts.indexOf(productId);

      input.checked = false;
      label?.classList.remove("bg-primary/80");
      if (arrayIndex > -1) {
        newProducts.splice(arrayIndex, 1);
      }
      setData((prev) => ({
        ...prev,
        validProducts: newProducts,
      }));
    },
    [data],
  );

  const selectAllProducts = useCallback(() => {
    const newProducts: Array<string> = JSON.parse(
      JSON.stringify(data.validProducts),
    );
    products.map((product) => {
      const label = document.getElementById(product._id)?.children[0];
      const input = label?.children[0] as HTMLInputElement;

      if (!newProducts.includes(input.value)) {
        input.checked = true;
        label?.classList.add("bg-primary/80");
        newProducts.push(input.value);
        setData((prev) => ({
          ...prev,
          validProducts: newProducts,
        }));
      }
    });
  }, [products, data]);

  const deselectAllProducts = useCallback(() => {
    const newProducts: Array<string> = JSON.parse(
      JSON.stringify(data.validProducts),
    );
    products.map((product) => {
      const label = document.getElementById(product._id)?.children[0];
      const input = label?.children[0] as HTMLInputElement;
      const arrayIndex = newProducts.indexOf(input.value);

      input.checked = false;
      label?.classList.remove("bg-primary/80");
      if (arrayIndex > -1) {
        newProducts.splice(arrayIndex, 1);
      }
      setData((prev) => ({
        ...prev,
        validProducts: newProducts,
      }));
    });
  }, [products, data]);

  const formCheck = useCallback(() => {
    for (let i = 0; i < Object.entries(data).length; i++) {
      const [key] = Object.entries(data)[i];
      console.log("KEY: ", key);
    }
  }, [data]);

  const formAppend = useCallback(() => {
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }
    return form;
  }, [data]);

  const submitHandler = async () => {
    console.log("DATA: ", data);
    // const form = formAppend();
    // setLoading(true);
    // setValidation([]);

    // try {
    //   const token = Cookies.get("token");
    //   const result = await createUser(form, token!);

    //   setTimeout(() => {
    //     setLoading(false);
    //     toast.success(result.message, { containerId: "Main" });
    //     modalHandler("create_voucher", false);
    //     router.refresh();
    //     stateChanges();
    //   }, 700);
    // } catch (error: any) {
    //   setLoading(false);
    //   setTimeout(() => {
    //     if (error.message == "Validation Error" || error.code == 11000) {
    //       return populateValidation(error, setValidation);
    //     }

    //     toast.error(error.message, { containerId: "CreateUser" });
    //   }, 700);
    // }
  };

  useEffect(() => {
    console.log(data.validProducts);
  }, [data.validProducts]);

  useEffect(() => {
    setFilteredProducts(getFilterProducts());
  }, [proSearch]);

  useEffect(() => {
    if (data.conditions == "Particular Product") {
      getProductsAPI();
    }
  }, [data.conditions]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm w-fit"
        onClick={() => modalHandler("create_voucher", true)}
      >
        Add Voucher
      </button>
      <dialog data-theme={"skies"} id="create_voucher" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-xl text-white">
          <h3 className="modal-title mb-5">New Voucher</h3>
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <TextInput
              dataState={{ data, setData }}
              label={["Voucher Name", "voucherName", "Enter voucher name"]}
              validations={validation}
            />
            <TextInput
              dataState={{ data, setData }}
              label={["Voucher Code", "voucherCode", "Enter voucher code"]}
              validations={validation}
            />
            <NumericInput
              dataState={{ data, setData }}
              isCurrency
              label={["Voucher Value", "value", "Enter voucher value"]}
              validations={validation}
            />
            <NumericInput
              dataState={{ data, setData }}
              label={["Quota", "voucherQuota", "Enter voucher quota"]}
              validations={validation}
            />
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text -ms-1 text-base text-white">
                  Status
                </span>
              </div>
              <select
                className="select select-bordered"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                value={data.status}
              >
                <option disabled value={""}>
                  Select status
                </option>
                <option value={"Active"}>Active</option>
                <option value={"Inactive"}>Inactive</option>
              </select>
              {/* <div className="label">
              <span className="label-text-alt">Alt label</span>
            </div> */}
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text -ms-1 text-base text-white">
                  Validity Period
                </span>
              </div>
              <input
                type="date"
                className="input input-bordered input-sm box-content rounded-md bg-transparent px-2 py-1 uppercase transition-all focus:outline-none focus:ring-0"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    validUntil: e.target.value,
                  }))
                }
                value={data.validUntil}
              />
            </label>
          </div>
          <div className="divider"></div>
          {/* Voucher Conditions */}
          <label className="form-control mx-auto w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1 w-full text-center text-base text-white">
                Voucher Conditions
              </span>
            </div>
            <select
              className="select select-bordered"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  conditions: e.target.value,
                }))
              }
              value={data.conditions}
            >
              <option disabled value={""}>
                Select conditions
              </option>
              <option value={"None"}>None</option>
              <option value={"Minimal Transaction"}>Minimal Transaction</option>
              <option value={"Particular Product"}>Particular Product</option>
              <option value={"Particular Category"}>Particular Category</option>
            </select>
            <div className="label">
              <span className="label-text-alt hidden">Alt label</span>
            </div>
          </label>

          {data.conditions == "Minimal Transaction" && (
            <div className="mx-auto w-full max-w-xs">
              <NumericInput
                dataState={{ data, setData }}
                isCurrency
                label={[
                  "Minimal Transaction",
                  "minTransaction",
                  "Enter minimal transaction",
                ]}
                validations={validation}
              />
            </div>
          )}
          {data.conditions == "Particular Product" && (
            // <Fragment>
            //   <div className="dropdown dropdown-top form-control mx-auto w-full">
            //     <label data-theme={"skies"} className="w-full transition-all">
            //       <div className="label">
            //         <span className="label-text -ms-1 text-base text-white">
            //           Product
            //         </span>
            //       </div>
            //       <input
            //         tabIndex={0}
            //         type={"text"}
            //         placeholder="Type here to search product"
            //         className={
            //           "input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
            //         }
            //         onChange={(e) => setProSearch(e.target.value)}
            //         value={proSearch}
            //       />
            //     </label>
            //     <ul
            //       tabIndex={0}
            //       className="no-scrollbar dropdown-content z-[1] flex h-[300px] w-full flex-col gap-y-2 overflow-y-scroll rounded-box border bg-base-100 p-2 shadow [&>li:hover]:bg-neutral/10"
            //     >
            //       {filteredProducts.map((product, index) => (
            //         <ProductOption
            //           key={index}
            //           product={product}
            //           selectHandler={(e) => selectProduct(e.target)}
            //         />
            //       ))}
            //     </ul>
            //   </div>
            //   {/* Button */}
            //   <div className="flex justify-center gap-x-2">
            //     <button
            //       className="btn btn-accent btn-sm flex text-white"
            //       disabled={data.validProducts.length == products.length}
            //       onClick={() => selectAllProducts()}
            //     >
            //       Select All
            //     </button>
            //     <button
            //       className="btn btn-accent btn-sm flex text-white"
            //       disabled={data.validProducts.length == 0}
            //       onClick={() => deselectAllProducts()}
            //     >
            //       Deselect All
            //     </button>
            //   </div>
            //   {data.validProducts.length > 0 && (
            //     <div className="flex flex-col">
            //       <span className="mb-3">{`Selected Product (${data.validProducts.length})`}</span>
            //       <div className="grid grid-cols-2 items-center gap-2">
            //         {products
            //           .filter((product) =>
            //             data.validProducts.includes(product._id),
            //           )
            //           .map((product, i) => {
            //             return (
            //               <ProductDisplay
            //                 key={i}
            //                 product={product}
            //                 deselect={() => deselectProduct(product._id)}
            //               />
            //             );
            //           })}
            //       </div>
            //     </div>
            //   )}
            // </Fragment>
            <EntitySelect
              data={data}
              filteredEntity={filteredProducts}
              searchLabel={[
                "Product Select",
                "Type here to search product name",
              ]}
              selectAll={selectAllProducts}
              deselectAll={deselectAllProducts}
              deselect={deselectProduct}
              selectHandler={(e) => selectProduct(e.target)}
              searchHandler={(e) => setProSearch(e.target.value)}
              validations={validation}
            />
          )}

          {data.conditions == "Particular Category" && (
            <label className="form-control mx-auto w-full max-w-xs">
              <div className="label">
                <span className="label-text -ms-1 text-base text-white">
                  Category
                </span>
              </div>
              <select
                className="select select-bordered"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    conditions: e.target.value,
                  }))
                }
                value={data.conditions}
              >
                <option disabled value={""}>
                  Select category to include
                </option>
                <option value={"category1"}>Category 1</option>
                <option value={"category2"}>Category 2</option>
                <option value={"category3"}>Category 3</option>
              </select>
              <div className="label">
                {/* <span className="label-text-alt hidden">Alt label</span> */}
              </div>
            </label>
          )}

          {/* Submit */}
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                // disabled={disable}
                onClick={submitHandler}
              >
                Create
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
              </button>
            )}

            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler("create_voucher", false)}
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

export default PostVoucherModal;
