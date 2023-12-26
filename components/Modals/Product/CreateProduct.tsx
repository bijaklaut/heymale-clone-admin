"use client";

import { ChangeEvent, useRef, useState } from "react";
import { createProduct } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes, PostProductTypes } from "../../../services/types";
import VariantInput from "./VariantInput";
import SelectCategory from "./SelectCategory";
import Image from "next/image";
import { NumericFormat } from "react-number-format";

interface CreateProductProps {
  categories: CategoryTypes[];
}

const CreateProductModal = (props: CreateProductProps) => {
  const router = useRouter();
  const { categories } = props;
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [preview, setPreview] = useState("");
  const [validation, setValidation] = useState({
    name: {
      message: "",
    },
    category: {
      message: "",
    },
    "variant.s": {
      message: "",
    },
    "variant.m": {
      message: "",
    },
    "variant.l": {
      message: "",
    },
    "variant.xl": {
      message: "",
    },
    price: {
      message: "",
    },
    description: {
      message: "",
    },
    thumbnail: {
      message: "",
    },
  });
  const [data, setData] = useState<PostProductTypes>({
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
  });

  const buttonCheck = () => {
    const { name, category, price, description } = data;

    if (!name || !category || !price || !description) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const variantHandler = (
    event: ChangeEvent<HTMLInputElement>,
    label: string,
  ) => {
    setData({
      ...data,
      variant: {
        ...data.variant,
        [label]: Number(event.target.value),
      },
    });
  };

  const categoryHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setData({
      ...data,
      category: event.target.value,
    });
    buttonCheck();
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    setDisable(true);
    setPreview("");
    setData({
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
    });
    setValidation({
      name: {
        message: "",
      },
      category: {
        message: "",
      },
      "variant.s": {
        message: "",
      },
      "variant.m": {
        message: "",
      },
      "variant.l": {
        message: "",
      },
      "variant.xl": {
        message: "",
      },
      price: {
        message: "",
      },
      description: {
        message: "",
      },
      thumbnail: {
        message: "",
      },
    });

    if (fileInput.current != null) {
      fileInput.current.value = "";
    }

    if (modal && show) {
      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async () => {
    const form = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (key == "variant") {
        for (const [k, v] of Object.entries(data.variant)) {
          form.append(`${key}[${k}]`, v);
        }
      } else {
        form.append(key, value);
      }
    }

    const loading = toast.loading("Processing..", {
      containerId: "CreateProduct",
    });

    try {
      const result = await createProduct(form);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler("addProd", false);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error") {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateProduct",
        });
        setValidation(error.errorDetail);
      } else if (error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateProduct",
        });
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateProduct",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm mb-3 mt-5 "
        onClick={() => modalHandler("addProd", true)}
      >
        Add Product
      </button>
      <dialog data-theme={"dracula"} id="addProd" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateProduct"}
          theme="dark"
        />
        <div className="modal-box max-w-4xl">
          <h3 className=" mb-5 text-lg font-bold text-primary">
            Add New Product
          </h3>
          {/* Product Name */}
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Product Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  name: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.name}
            />
            <div className="label">
              {validation.name?.message ? (
                <span className="label-text-alt text-error">
                  {validation.name?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          {/* Category */}
          <SelectCategory
            data={data}
            handler={categoryHandler}
            validation={validation}
            categories={categories}
          />
          {/* Variant */}
          <div>
            <label className="label">
              <span className="label-text -ms-1 block">Variant</span>
            </label>
            <div className="flex flex-wrap gap-x-8">
              <VariantInput
                label="s"
                handler={variantHandler}
                data={data}
                validation={validation}
              />
              <VariantInput
                label="m"
                handler={variantHandler}
                data={data}
                validation={validation}
              />
              <VariantInput
                label="l"
                handler={variantHandler}
                data={data}
                validation={validation}
              />
              <VariantInput
                label="xl"
                handler={variantHandler}
                data={data}
                validation={validation}
              />
            </div>
          </div>
          {/* Price */}
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Price</span>
            </div>
            <NumericFormat
              allowNegative={false}
              valueIsNumericString
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp. "
              value={data.price}
              onValueChange={(e) => {
                setData({
                  ...data,
                  price: Number(e.value),
                });
              }}
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
              placeholder="Input product price"
              onKeyUp={buttonCheck}
            />

            <div className="label">
              {validation.price?.message ? (
                <span className="label-text-alt text-error">
                  {validation.price?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          {/* Description */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Type product decription"
              onChange={(e) => {
                setData({
                  ...data,
                  description: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.description}
            ></textarea>
            <div className="label">
              {validation.description?.message ? (
                <span className="label-text-alt text-error">
                  {validation.description?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          {/* Thumbnail */}
          <div className="flex gap-x-3">
            <div className="flex h-[250px] w-[250px] items-center justify-center rounded-md bg-neutral">
              <Image
                src={preview == "" ? "icon/image.svg" : preview}
                width={preview == "" ? 60 : 150}
                height={preview == "" ? 60 : 150}
                alt="upload-icon"
                className={
                  preview != ""
                    ? "h-full w-auto object-cover"
                    : "h-auto w-[100px]"
                }
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Thumbnail</span>
              </div>
              <input
                type="file"
                ref={fileInput}
                className="file-input file-input-bordered w-full max-w-xs"
                accept="image/jpg, image/jpeg, image/png"
                onChange={(e) => {
                  if (e.target.files instanceof FileList) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setData({
                      ...data,
                      thumbnail: e.target.files[0],
                    });
                  }
                }}
              />
              <div className="label">
                {validation.thumbnail?.message ? (
                  <span className="label-text-alt text-error">
                    {validation.thumbnail?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </label>
          </div>
          {/* Submit */}
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-sm"
              disabled={disable}
              onClick={submitHandler}
            >
              Confirm
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-outline btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateProductModal;
