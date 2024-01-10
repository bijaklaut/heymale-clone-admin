"use client";

import { ChangeEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes } from "../../../services/types";
import { updateCategory } from "../../../services/admin";
import { EditSvg } from "../../Misc/SvgGroup";

interface thisProps {
  category: CategoryTypes;
  index: number;
  stateChanges(): void;
}
const UpdateCategoryModal = (props: thisProps) => {
  const router = useRouter();
  const { category, index, stateChanges } = props;
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: category.name,
  });
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      setData({
        name: category.name,
      });
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

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: event.target.value,
    });

    if (!event.target.value) {
      return setDisable(true);
    }

    return setDisable(false);
  };

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    try {
      const result = await updateCategory(data, id);

      if (result.payload) {
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`updateCat${index}`, false);
        setTimeout(() => setLoading(false), 600);

        router.refresh();
        return stateChanges();
      }
    } catch (error: any) {
      setTimeout(() => setLoading(false), 600);

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

        return toast.error(error.message, {
          containerId: "UpdateCategory",
        });
      }

      return toast.error(error.message, {
        containerId: "UpdateCategory",
      });
    }
  };

  return (
    <>
      <button
        className="text-gray-600 transition-all hover:text-blue-500"
        onClick={() => modalHandler(`updateCat${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog
        data-theme={"nord"}
        id={`updateCat${index}`}
        className="modal text-neutral"
      >
        <ToastContainer
          enableMultiContainer
          containerId={"UpdateCategory"}
          theme="dark"
        />
        <div className="modal-box absolute">
          <h3 className="mb-5 text-lg font-bold text-primary">
            Update Category
          </h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Category Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border border-neutral p-2 focus:outline-0 focus:ring-0"
              onChange={(e) => changeHandler(e)}
              value={data.name}
            />
            <div className="label">
              {validation.map((val) => {
                return val.field == "name" ? (
                  <span className="label-text-alt text-error">
                    {val.message}
                  </span>
                ) : (
                  ""
                );
              })}
            </div>
          </label>
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm text-white"
                disabled={disable}
                onClick={() => submitHandler(category._id, index)}
              >
                Update
              </button>
            ) : (
              <button className="btn btn-disabled btn-sm">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

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

export default UpdateCategoryModal;
