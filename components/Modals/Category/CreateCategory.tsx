"use client";

import { useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddCategoryModal = () => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState({
    name: "",
  });
  const [validation, setValidation] = useState({
    name: {
      message: "",
    },
  });

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    setValidation({
      name: {
        message: "",
      },
    });
    setData({
      name: "",
    });

    if (modal && show) {
      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
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

  const submitHandler = async () => {
    const loading = toast.loading("Processing..", {
      containerId: "CreateCategory",
    });

    try {
      const result = await createCategory(data);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler("addCat", false);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error") {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateCategory",
        });
        setValidation(error.errorDetail);
      } else if (error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateCategory",
        });
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateCategory",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm mb-3 mt-5 "
        onClick={() => modalHandler("addCat", true)}
      >
        Add Category
      </button>
      <dialog data-theme={"dracula"} id="addCat" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateCategory"}
          theme="dark"
        />
        <div className="modal-box">
          <h3 className=" mb-5 text-lg font-bold text-primary">Add Category</h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Category Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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

export default AddCategoryModal;
