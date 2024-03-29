"use client";

import { useEffect, useRef, useState } from "react";
import { createProduct } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CategoryTypes,
  PostProductTypes,
  ValidationTypes,
} from "../../../services/types";
import Image from "next/image";
import TextInput from "../../Form/TextInput";
import { buttonCheck, populateValidation } from "../../../services/helper";
import VariantInput from "./VariantInput";
import TextArea from "../../Form/TextAreaInput";
import NumericInput from "../../Form/NumericInput";
import FileInput from "../../Form/FileInput";
import Cookies from "js-cookie";
import StatusInput from "./StatusInput";
import SelectInput from "../../Form/SelectInput";

interface CreateProductProps {
  categories: CategoryTypes[];
  stateChanges(): void;
}

const initialState = () => {
  return {
    name: "",
    category: "",
    variant: {
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
    },
    price: 0,
    description: "",
    thumbnail: "",
    status: "Active",
    weight: 0,
  };
};

const CreateProductModal = (props: CreateProductProps) => {
  const { categories, stateChanges } = props;
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState<PostProductTypes>(initialState());
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
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
      setDisable(true);
      setData(initialState());
      setLoading(false);
      setPreview("");
      setValidation([]);

      return modal.showModal();
    }

    modal.close();
  };

  const submitHandler = async () => {
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
      const result = await createProduct(form, true);

      if (result.status >= 300) throw result;

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        modalHandler("addProd", false);
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
        className="btn btn-primary btn-sm w-fit"
        onClick={() => modalHandler("addProd", true)}
      >
        Add Product
      </button>
      <dialog id="addProd" data-theme={"skies"} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateProduct"}
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
          <div className="grid grid-cols-1 place-content-between content-between items-center justify-between sm:grid-cols-2">
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
              <Image
                src={preview || "icon/image.svg"}
                width={!preview ? 60 : 150}
                height={!preview ? 60 : 150}
                alt="upload-icon"
                className={
                  preview ? "h-full w-auto object-cover" : "h-auto w-[100px]"
                }
              />
            </div>
          </div>
          {/* Submit */}
          <div className="modal-action mt-16 flex">
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
                onClick={() => modalHandler("addProd", false)}
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

export default CreateProductModal;
