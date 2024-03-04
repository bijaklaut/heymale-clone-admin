"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createVoucher,
  getCategories,
  getProducts,
  updateVoucher,
} from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CategoryTypes,
  PostVoucherTypes,
  ProductTypes,
  ValidationTypes,
  VoucherTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import { populateValidation } from "../../../services/helper";
import TextInput from "../../Form/TextInput";
import NumericInput from "../../Form/NumericInput";
import EntitySelect from "./EntitySelect";
import StatusSelect from "./StatusSelect";
import ValidityPeriod from "./ValidityPeriod";
import ConditionsSelect from "./ConditionsSelect";

const initData = (voucher?: VoucherTypes) => {
  if (voucher) {
    let productIds: Array<string> = [];
    let categoryIds: Array<string> = [];

    voucher.validProducts.map((product) => productIds.push(product._id));
    voucher.validCategories.map((category) => categoryIds.push(category._id));

    return {
      id: voucher._id,
      voucherName: voucher.voucherName,
      voucherCode: voucher.voucherCode,
      conditions: voucher.conditions,
      minTransaction: voucher.minTransaction,
      validProducts: productIds,
      validCategories: categoryIds,
      value: voucher.value,
      validUntil: voucher.validUntil,
      status: voucher.status,
      voucherQuota: voucher.voucherQuota,
    };
  }

  return {
    voucherName: "",
    voucherCode: "",
    conditions: "",
    minTransaction: 0,
    validProducts: [],
    validCategories: [],
    value: 0,
    validUntil: "",
    status: "",
    voucherQuota: 0,
  };
};

interface ThisProps {
  stateChanges(): void;
  voucher?: VoucherTypes;
  isUpdate: boolean;
  reset(): void;
}

const PostVoucherModal = (props: ThisProps) => {
  const { stateChanges, voucher, isUpdate, reset } = props;
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostVoucherTypes>(initData());
  const [loading, setLoading] = useState(false);
  const [proSearch, setProSearch] = useState("");
  const [updateState, setUpdateState] = useState(false);

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductTypes[]>([]);

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryTypes[]>(
    [],
  );

  const modalHandler = useCallback(
    (id: string, show: boolean, updateItem?: VoucherTypes) => {
      const modal = document.getElementById(id) as HTMLDialogElement;
      setDisable(true);
      setValidation([]);

      if (updateItem) {
        setData(initData(updateItem));
        setUpdateState(true);
      }

      if (updateItem && show) {
        return modal.showModal();
      }

      if (show) {
        setData(initData());
        setUpdateState(false);
        return modal.showModal();
      }

      return modal.close();
    },
    [voucher],
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

  const getFilterProducts = useCallback(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(proSearch.toLowerCase()),
      ),
    [products, proSearch],
  );

  const getFilterCategories = useCallback(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(proSearch.toLowerCase()),
      ),
    [categories, proSearch],
  );

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
    (entityId: string, fieldLabel: string) => {
      const newArray: Array<string> = JSON.parse(
        JSON.stringify((data as any)[fieldLabel]),
      );
      const label = document.getElementById(entityId)?.children[0];
      const input = label?.children[0] as HTMLInputElement;
      const arrayIndex = newArray.indexOf(entityId);

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
      if (key == "validProducts" || key == "validCategories") {
        for (const [k, v] of Object.entries((data as any)[key])) {
          form.append(`${key}[${k}]`, v as string);
        }
      } else {
        form.append(key, value);
      }
    }

    return form;
  }, [data]);

  const submitHandler = useCallback(async () => {
    try {
      const form = formAppend();

      setLoading(true);
      setValidation([]);

      if (!updateState) {
        const result = await createVoucher(form, true);

        setTimeout(() => {
          setLoading(false);
          toast.success(result.message, { containerId: "Main" });
          modalHandler("create_voucher", false);

          router.refresh();
          stateChanges();
        }, 700);
      } else {
        const result = await updateVoucher(form, true);
        setTimeout(() => {
          setLoading(false);
          toast.success(result.message, { containerId: "Main" });
          modalHandler("create_voucher", false);

          router.refresh();
          stateChanges();
        }, 700);
      }
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "ValidationError" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }
        toast.error(error.message, { containerId: "CreateUser" });
      }, 700);
    }
  }, [data, updateState]);

  useEffect(() => {
    if (data.conditions == "Particular Product") {
      setFilteredProducts(getFilterProducts());
    } else {
      setFilteredCategories(getFilterCategories());
    }
  }, [proSearch, data.conditions]);

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

  useEffect(() => {
    if (isUpdate) {
      reset();
      modalHandler("create_voucher", true, voucher);
    }
  }, [isUpdate]);

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
        <div className="no-scrollbar modal-box absolute max-w-[800px] text-white">
          <h3 className="modal-title mb-5">
            {!updateState ? "New Voucher" : "Update Voucher"}
          </h3>
          <div className="mx-auto grid grid-cols-1 gap-x-3 max-sm:max-w-[350px] sm:grid-cols-2">
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
            <StatusSelect
              label={["Status", "status", "Select voucher status"]}
              value={data.status}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              validations={validation}
            />
            <ValidityPeriod
              label={["Validity Period", "validUntil"]}
              value={data.validUntil}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  validUntil: e.target.value,
                }))
              }
              validations={validation}
            />
          </div>
          <div className="divider"></div>
          {/* Voucher Conditions */}
          <ConditionsSelect
            label={[
              "Voucher Conditions",
              "conditions",
              "Select voucher conditions",
            ]}
            value={data.conditions}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                conditions: e.target.value,
              }))
            }
            validations={validation}
          />

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
                {!updateState ? "Create" : "Update"}
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                {!updateState ? "Creating.." : "Updating.."}
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
