"use client";

import { useEffect, useRef, useState } from "react";
import { updateProduct } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CategoryTypes,
  PostProductTypes,
  ProductTypes,
  ValidationTypes,
} from "../../../services/types";
import Image from "next/image";
import VariantInput from "./VariantInput";
import { EditSvg, ImageSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import { buttonCheck, populateValidation } from "../../../services/helper";
import TextArea from "../../Form/TextAreaInput";
import NumericInput from "../../Form/NumericInput";
import FileInput from "../../Form/FileInput";
import StatusInput from "./StatusInput";
import SelectInput from "../../Form/SelectInput";

interface ThisProps {
  product: ProductTypes;
  index: number;
  categories: CategoryTypes[];
  stateChanges(): void;
}

const initialData = (product: ProductTypes) => {
  return {
    name: product.name,
    category: product.category._id,
    variant: {
      s: product.variant.s,
      m: product.variant.m,
      l: product.variant.l,
      xl: product.variant.xl,
    },
    price: product.price,
    description: product.description,
    thumbnail: product.thumbnail,
    status: product.status,
    weight: product.weight,
  };
};

const UpdateProductModal = (props: ThisProps) => {
  const { product, index, categories, stateChanges } = props;
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostProductTypes>(initialData(product));
  const btnCheckProps = {
    data,
    requiredField: ["name", "category", "price", "description", "weight"],
    setDisable,
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (fileInput.current != null) {
      fileInput.current.value = "";
    }

    if (show) {
      setData(initialData(product));
      setDisable(true);
      setLoading(false);
      setPreview("");
      setValidation([]);

      return modal.showModal();
    }

    modal.close();
  };

  const submitHandler = async (id: string, index: number) => {
    const form = new FormData();
    setLoading(true);
    setValidation([]);

    for (const [key, value] of Object.entries(data)) {
      if (key == "variant") {
        for (const [k, v] of Object.entries(data.variant)) {
          form.append(`${key}[${k}]`, v);
        }
      } else {
        form.append(key, value);
      }
    }

    try {
      const result = await updateProduct(form, id, true);

      if (result.status >= 300) throw result;

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        modalHandler(`updateProd${index}`, false);
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "CreateProduct" });
      }, 700);
    }
  };
  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-primary"
        onClick={() => modalHandler(`updateProd${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`updateProd${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"updateProduct"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-3xl text-white">
          <h3 className="modal-title mb-5">Add New Product</h3>
          {/* Product Name & Category */}
          <div className="flex w-full flex-col gap-x-3 sm:flex-row">
            <TextInput
              dataState={{ data, setData }}
              label={["Product Name", "name", "Enter product name"]}
              validations={validation}
            />
            <SelectInput
              selectionData={categories}
              dataState={{ data, setData }}
              label={[
                "Product Category",
                "category",
                "Select product category",
              ]}
              validations={validation}
            />
          </div>
          {/* Variants */}
          <div>
            <label className="label">
              <span className="label-text -ms-1 block text-base text-white">
                Product Variant
              </span>
            </label>
            <div className="mb-3 grid grid-cols-2 gap-x-5 gap-y-2 md:grid-cols-4 ">
              {["s", "m", "l", "xl"].map((v, i) => {
                return (
                  <VariantInput
                    key={i}
                    label={v}
                    dataState={{ data, setData }}
                    validations={validation}
                  />
                );
              })}
            </div>
          </div>
          {/* Description */}
          <TextArea
            label={["Description", "description", "Enter product description"]}
            dataState={{ data, setData }}
            validations={validation}
          />
          {/* Price, Thumbnail, Status */}
          <div className="grid grid-cols-1 place-content-between content-between justify-between sm:grid-cols-2">
            <div className="flex flex-col">
              <NumericInput
                isCurrency
                label={["Price", "price", "Enter product price"]}
                validations={validation}
                dataState={{ data, setData }}
              />
              <NumericInput
                label={["Weight (gram)", "weight", "Enter product weight"]}
                validations={validation}
                dataState={{ data, setData }}
              />
              <StatusInput dataState={{ data, setData }} label="status" />
              <FileInput
                fileSetState={{ setData, setPreview }}
                label={["Thumbnail", "thumbnail"]}
                ref={fileInput}
                validations={validation}
              />
            </div>
            <div className="flex h-[300px] w-[300px] items-center justify-center place-self-center self-center rounded-md bg-neutral sm:h-[250px] sm:w-[250px] md:h-[300px] md:w-[300px]">
              {preview ? (
                <Image
                  src={preview}
                  width={150}
                  height={150}
                  alt="preview"
                  className={"h-full w-auto object-cover"}
                />
              ) : data.thumbnail ? (
                <Image
                  src={data.thumbnail as string}
                  width={150}
                  height={150}
                  alt="preview"
                  className={"h-full w-auto bg-white object-cover"}
                />
              ) : (
                <ImageSvg className="h-auto w-[100px] fill-white" />
              )}
            </div>
          </div>
          {/* Submit */}
          <div className="modal-action mt-16 flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
                onClick={() => submitHandler(product._id, index)}
              >
                Update
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler(`updateProd${index}`, false)}
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

export default UpdateProductModal;
