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
  };
};

const UpdateProductModal = (props: ThisProps) => {
  const { product, index, categories, stateChanges } = props;
  const IMG_API = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostProductTypes>(initialData(product));
  const btnCheckProps = {
    data,
    requiredField: ["name", "category", "price", "description"],
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
      const token = Cookies.get("token");
      const result = await updateProduct(form, id, token!);

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
          <h3 className="modal-title mb-5">Update Product</h3>
          {/* Product Name & Category */}
          <div className="flex w-full gap-x-3">
            <TextInput
              dataState={{ data, setData }}
              label={["Product Name", "name", "Enter product name"]}
              validations={validation}
            />
            <SelectInput
              categories={categories}
              dataState={{ data, setData }}
              label={[
                "Product Category",
                "category",
                "Select product category",
              ]}
              validations={validation}
            />
          </div>
          {/* Variant */}
          <div>
            <label className="label">
              <span className="label-text -ms-1 block text-white">Variant</span>
            </label>
            <div className="mb-3 flex flex-wrap justify-between">
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

          {/* Thumbnail & Price */}
          <div className="flex items-center justify-between">
            <div className="flex w-1/2 flex-col">
              <NumericInput
                isCurrency
                label={["Price", "price", "Enter product price"]}
                validations={validation}
                dataState={{ data, setData }}
              />
              <FileInput
                ref={fileInput}
                label={["Thumbnail", "thumbnail"]}
                validations={validation}
                fileSetState={{ setData, setPreview }}
              />
              <StatusInput dataState={{ data, setData }} label="status" />
            </div>
            <div className="flex h-[250px] w-[250px] items-center justify-center rounded-md bg-neutral">
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
                  src={`${IMG_API}/product/${data.thumbnail}`}
                  width={150}
                  height={150}
                  alt="preview"
                  className={"h-full w-auto object-cover"}
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
