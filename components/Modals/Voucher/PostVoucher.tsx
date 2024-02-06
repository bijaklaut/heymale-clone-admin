"use client";

import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import {
  createUser,
  getCategories,
  getProducts,
} from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CategoryTypes,
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
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>([]);

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryTypes[]>(
    [],
  );

  const [proSearch, setProSearch] = useState("");

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

  const getCategoriesAPI = useCallback(async () => {
    const { payload } = await getCategories();
    setCategories(payload.docs);
    setFilteredCategories(payload.docs);
  }, []);

  const getFilterProducts = useCallback(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(proSearch.toLowerCase()),
    );
  }, [products, proSearch]);

  const getFilterCategories = useCallback(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(proSearch.toLowerCase()),
    );
  }, [categories, proSearch]);

  const selectHandler = useCallback(
    (element: HTMLInputElement, fieldLabel: string) => {
      const parent = element.parentElement;
      const newArray: Array<string> = JSON.parse(
        JSON.stringify((data as any)[fieldLabel]),
      );

      if (element.checked) {
        parent?.classList.add("bg-primary/80");
        newArray.push(element.value);
        setData((prev) => ({
          ...prev,
          [fieldLabel]: newArray,
        }));
      } else {
        const arrayIndex = newArray.indexOf(element.value);
        if (arrayIndex > -1) {
          newArray.splice(arrayIndex, 1);
        }
        parent?.classList.remove("bg-primary/80");
        setData((prev) => ({
          ...prev,
          [fieldLabel]: newArray,
        }));
      }
    },
    [data],
  );

  const deselectHandler = useCallback(
    (productId: string, fieldLabel: string) => {
      const newArray: Array<string> = JSON.parse(
        JSON.stringify((data as any)[fieldLabel]),
      );
      const label = document.getElementById(productId)?.children[0];
      const input = label?.children[0] as HTMLInputElement;
      const arrayIndex = newArray.indexOf(productId);

      input.checked = false;
      label?.classList.remove("bg-primary/80");
      if (arrayIndex > -1) {
        newArray.splice(arrayIndex, 1);
      }
      setData((prev) => ({
        ...prev,
        [fieldLabel]: newArray,
      }));
    },
    [data],
  );

  const selectAll = useCallback(
    (fieldLabel: string) => {
      const newArray: Array<string> = JSON.parse(
        JSON.stringify((data as any)[fieldLabel]),
      );
      const action = (entity: ProductTypes | CategoryTypes) => {
        const label = document.getElementById(entity._id)?.children[0];
        const input = label?.children[0] as HTMLInputElement;

        if (!newArray.includes(input.value)) {
          input.checked = true;
          label?.classList.add("bg-primary/80");
          newArray.push(input.value);
          setData((prev) => ({
            ...prev,
            [fieldLabel]: newArray,
          }));
        }
      };

      fieldLabel == "validProducts"
        ? products.map((product) => action(product))
        : categories.map((category) => action(category));
    },
    [products, categories, data],
  );

  const deselectAll = useCallback(
    (fieldLabel: string) => {
      const newArray: Array<string> = JSON.parse(
        JSON.stringify((data as any)[fieldLabel]),
      );
      const action = (entity: ProductTypes | CategoryTypes) => {
        const label = document.getElementById(entity._id)?.children[0];
        const input = label?.children[0] as HTMLInputElement;
        const arrayIndex = newArray.indexOf(input.value);

        input.checked = false;
        label?.classList.remove("bg-primary/80");
        if (arrayIndex > -1) {
          newArray.splice(arrayIndex, 1);
        }
        setData((prev) => ({
          ...prev,
          [fieldLabel]: newArray,
        }));
      };

      fieldLabel == "validProducts"
        ? products.map((product) => action(product))
        : categories.map((category) => action(category));
    },
    [products, data],
  );

  const formCheck = useCallback(() => {
    for (let i = 0; i < Object.entries(data).length; i++) {
      const [key] = Object.entries(data)[i];

      if (
        key == "minTransaction" &&
        data.conditions !== "Minimal Transaction"
      ) {
        continue;
      }

      if (key == "validProducts" && data.conditions !== "Particular Product") {
        continue;
      }

      if (
        key == "validCategories" &&
        data.conditions !== "Particular Category"
      ) {
        continue;
      }

      if (Array.isArray((data as any)[key])) {
        const newArray: Array<string> = (data as any)[key];

        if (newArray.length == 0) {
          setDisable(true);
          break;
        }
      }

      if (!Array.isArray((data as any)[key]) && !(data as any)[key]) {
        setDisable(true);
        break;
      }

      setDisable(false);
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
    if (data.conditions == "Particular Product") {
      setFilteredProducts(getFilterProducts());
    } else {
      setFilteredCategories(getFilterCategories());
    }
  }, [proSearch]);

  useEffect(() => {
    if (data.conditions == "Particular Product") {
      getProductsAPI();
      setData((prev) => ({
        ...prev,
        validCategories: [],
        minTransaction: 0,
      }));
    }

    if (data.conditions == "Particular Category") {
      getCategoriesAPI();
      setData((prev) => ({
        ...prev,
        minTransaction: 0,
        validProducts: [],
      }));
    }

    if (data.conditions == "Minimal Transaction") {
      getCategoriesAPI();
      setData((prev) => ({
        ...prev,
        validProducts: [],
        validCategories: [],
      }));
    }

    if (data.conditions == "None") {
      getCategoriesAPI();
      setData((prev) => ({
        ...prev,
        validProducts: [],
        validCategories: [],
        minTransaction: 0,
      }));
    }
  }, [data.conditions]);

  useEffect(() => {
    formCheck();
  }, [data]);

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
            <EntitySelect
              data={data}
              entities={products}
              filteredEntity={filteredProducts}
              searchLabel={[
                "Product Select",
                "Type here to search product name",
              ]}
              selectAll={() => selectAll("validProducts")}
              deselectAll={() => deselectAll("validProducts")}
              deselect={deselectHandler}
              selectHandler={(e) => selectHandler(e.target, "validProducts")}
              searchHandler={(e) => setProSearch(e.target.value)}
              validations={validation}
            />
          )}

          {data.conditions == "Particular Category" && (
            <EntitySelect
              data={data}
              entities={categories}
              filteredEntity={filteredCategories}
              searchLabel={["Category Select", "Type here to search category"]}
              selectAll={() => selectAll("validCategories")}
              deselectAll={() => deselectAll("validCategories")}
              deselect={deselectHandler}
              selectHandler={(e) => selectHandler(e.target, "validCategories")}
              searchHandler={(e) => setProSearch(e.target.value)}
              validations={validation}
            />
          )}

          {/* Submit */}
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
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
