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
import TextInput from "../../Form/TextInput";

interface CreateProductProps {
  categories: CategoryTypes[];
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
  };
};

const CreateProductModal = (props: CreateProductProps) => {
  const { categories } = props;
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState<PostProductTypes>(initialState());

  const buttonCheck = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!event.target.value) {
      return setDisable(true);
    }

    return setDisable(false);
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

  const changeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    label: string,
  ) => {
    setData({
      ...data,
      [label]: event.target.value,
    });

    buttonCheck(event);
  };

  const categoryHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setData({
      ...data,
      category: event.target.value,
    });
    buttonCheck(event);
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (fileInput.current != null) {
      fileInput.current.value = "";
    }

    if (modal && show) {
      setDisable(true);
      setPreview("");
      setData(initialState());
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);

      return modal.showModal();
    }

    return modal.close();
  };

  const submitHandler = async () => {
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);
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
        for (const [key] of Object.entries(error.errorDetail)) {
          setValidation((prev) => [
            ...prev,
            {
              field: key,
              message: error.errorDetail[key].message,
            },
          ]);
        }
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
      <dialog id="addProd" data-theme={"nord"} className="modal text-neutral">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateProduct"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-3xl bg-gray-700">
          <h3 className=" mb-5 text-lg font-bold text-white">
            Add New Product
          </h3>
          {/* Product Name & Category */}
          <div className="flex w-full gap-x-3">
            <TextInput
              data={data}
              label={["Product Name", "name", "Enter product name"]}
              onChange={changeHandler}
              validation={validation}
            />
            <SelectCategory
              data={data}
              handler={categoryHandler}
              validation={validation}
              categories={categories}
            />
          </div>
          {/* Variant */}
          <div>
            <label className="label">
              <span className="label-text -ms-1 block text-white">Variant</span>
            </label>
            <div className="mb-3 flex flex-wrap justify-between">
              <VariantInput
                data={data}
                label="s"
                validation={validation}
                handler={variantHandler}
              />
              <VariantInput
                label="m"
                handler={variantHandler}
                validation={validation}
                data={data}
              />
              <VariantInput
                data={data}
                label="l"
                validation={validation}
                handler={variantHandler}
              />
              <VariantInput
                data={data}
                label="xl"
                validation={validation}
                handler={variantHandler}
              />
            </div>
          </div>

          {/* Description */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-white">Description</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24 p-2"
              placeholder="Type product decription"
              onChange={(e) => {
                setData({
                  ...data,
                  description: e.target.value,
                });
              }}
              value={data.description}
            ></textarea>
            <div className="label">
              {validation.map((val) => {
                return val.field == "description" ? (
                  <span className="label-text-alt text-error">
                    {val.message}
                  </span>
                ) : (
                  ""
                );
              })}
            </div>
          </label>
          {/* Thumbnail & Price */}
          <div className="flex justify-between">
            <div className="flex w-1/2 flex-col">
              <label className="w-full">
                <div className="label">
                  <span className="label-text -ms-1 text-white">Price</span>
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

                    if (!e.value) return setDisable(true);
                    return setDisable(false);
                  }}
                  className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-neutral focus:outline-0 focus:ring-0"
                  placeholder="Input product price"
                />

                <div className="label">
                  {validation.map((val, i) =>
                    val.field == "price" ? (
                      <span key={i} className="label-text-alt text-error">
                        {val.message}
                      </span>
                    ) : (
                      ""
                    ),
                  )}
                </div>
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-white">Thumbnail</span>
                </div>
                <input
                  type="file"
                  ref={fileInput}
                  className="file-input file-input-sm w-full border-0"
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
                  {validation.map((val) => {
                    return val.field == "thumbnail" ? (
                      <span className="label-text-alt text-error">
                        {val.message}
                      </span>
                    ) : (
                      ""
                    );
                  })}
                </div>
              </label>
            </div>
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
          </div>
          {/* Submit */}
          <div className="modal-action mt-16 flex">
            <button
              className="btn btn-primary btn-sm text-white"
              // disabled={disable}
              onClick={submitHandler}
            >
              Create
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm border-transparent bg-transparent text-white hover:border-white hover:bg-transparent">
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
