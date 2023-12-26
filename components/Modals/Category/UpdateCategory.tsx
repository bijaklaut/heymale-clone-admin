"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes } from "../../../services/types";
import { updateCategory } from "../../../services/admin";

interface thisProps {
  category: CategoryTypes;
  index: number;
}
const UpdateCategoryModal = (props: thisProps) => {
  const router = useRouter();
  const { category, index } = props;
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState({
    name: category.name,
  });
  const [validation, setValidation] = useState({
    name: {
      message: "",
    },
  });

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      modal.showModal();
      setData({
        name: category.name,
      });
      buttonCheck();
    } else if (modal && show == false) {
      modal.close();
      setValidation({
        name: {
          message: "",
        },
      });
    }
  };

  const buttonCheck = () => {
    const { name } = data;

    if (!name) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const loading = toast.loading("Processing..", {
      containerId: "UpdateCategory",
    });
    try {
      const result = await updateCategory(data, id);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`updateCat${index}`, false);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error") {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdateCategory",
        });
        setValidation(error.errorDetail);
      } else if (error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdateCategory",
        });
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdateCategory",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-xs text-white "
        onClick={() => modalHandler(`updateCat${index}`, true)}
      >
        Update
      </button>
      <dialog data-theme={"dracula"} id={`updateCat${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"UpdateCategory"}
          theme="dark"
        />
        <div className="modal-box">
          <h3 className=" mb-5 text-lg font-bold text-primary">
            Update Category
          </h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Category Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) =>
                setData({
                  name: e.target.value,
                })
              }
              onKeyUp={buttonCheck}
              value={data.name}
            />
            <div className="label">
              {validation.name.message ? (
                <span className="label-text-alt text-error">
                  {validation.name.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-sm"
              disabled={disable}
              onClick={() => submitHandler(category._id, index)}
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

export default UpdateCategoryModal;
