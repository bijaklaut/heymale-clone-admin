"use client";

import { ChangeEvent, useRef, useState } from "react";
import { updatePayment, updateProduct } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import {
  CategoryTypes,
  PostProductTypes,
  ProductTypes,
} from "../../../services/types";
import Image from "next/image";
import SelectCategory from "./SelectCategory";
import VariantInput from "./VariantInput";
import { NumericFormat } from "react-number-format";
import { EditSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import { revalidatePath } from "next/cache";

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
  };
};

const UpdateProductModal = (props: ThisProps) => {
  const { product, index, categories, stateChanges } = props;
  const IMG_API = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState<PostProductTypes>(initialData(product));

  const buttonCheck = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (!event.target.value) {
      return setDisable(true);
    }

    return setDisable(false);
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
    buttonCheck(event);
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (fileInput.current != null) {
      fileInput.current.value = "";
    }

    if (modal && show) {
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);
      setData(initialData(product));
      setDisable(true);

      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
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
      containerId: "UpdateProduct",
    });

    try {
      const result = await updateProduct(form, id);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, { containerId: "Main" });

        modalHandler(`updateProd${index}`, false);
        router.refresh();
        return stateChanges();
      }
    } catch (error: any) {
      if (error.message == "Validation Error" || error.code == 11000) {
        for (const [key] of Object.entries(error.errorDetail)) {
          setValidation((prev) => [
            ...prev,
            {
              field: key,
              message: error.errorDetail[key].message,
            },
          ]);
        }
      }

      toast.dismiss(loading);
      toast.error(error.message, { containerId: "CreateProduct" });
    }
  };

  return (
    <>
      <button
        className="text-gray-600 transition-all hover:text-blue-500"
        onClick={() => modalHandler(`updateProd${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"nord"} id={`updateProd${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"updateProduct"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-3xl bg-gray-700">
          <h3 className=" mb-5 text-lg font-bold text-white">Update Product</h3>
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
              {["s", "m", "l", "xl"].map((v, i) => {
                return (
                  <VariantInput
                    key={i}
                    label={v}
                    handler={variantHandler}
                    data={data}
                    validation={validation}
                  />
                );
              })}
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
                buttonCheck(e);
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
              {!preview ? (
                <Image
                  src={
                    data.thumbnail
                      ? `${IMG_API}/product/${data.thumbnail}`
                      : "icon/image.svg"
                  }
                  width={150}
                  height={150}
                  alt="upload-icon"
                  className={
                    data.thumbnail
                      ? "h-full w-auto object-cover"
                      : "h-auto w-[100px]"
                  }
                />
              ) : (
                <Image
                  src={preview}
                  width={150}
                  height={150}
                  alt="upload-icon"
                  className={"h-full w-auto object-cover"}
                />
              )}
            </div>
          </div>
          {/* Submit */}
          <div className="modal-action mt-16 flex">
            <button
              className="btn btn-primary btn-sm text-white"
              disabled={disable}
              onClick={() => submitHandler(product._id, index)}
            >
              Update
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

export default UpdateProductModal;
