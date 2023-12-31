"use client";

import { ChangeEvent, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddCategoryModal = () => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
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
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);
      setData({
        name: "",
      });

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

  const submitHandler = async () => {
    setLoading(true);
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    try {
      const result = await createCategory(data);

      if (result.payload) {
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler("addCat", false);
        setTimeout(() => setLoading(false), 600);
        return router.refresh();
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

        return toast.error(error.message, { containerId: "CreateCategory" });
      }

      return toast.error(error.message, { containerId: "CreateCategory" });
    }
  };

  return (
    <>
      <button
        data-theme={"nord"}
        className="btn btn-primary btn-sm mb-3 mt-5 text-white"
        onClick={() => modalHandler("addCat", true)}
      >
        Add Category
      </button>
      <dialog data-theme={"nord"} id="addCat" className="modal text-neutral">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateCategory"}
          theme="dark"
        />
        <div className="modal-box absolute">
          <h3 className=" mb-5 text-lg font-bold text-primary">Add Category</h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1 font-semibold">
                Category Name
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter category name"
              className="input h-10 w-full rounded-md border border-neutral p-2 focus:outline-0 focus:ring-0"
              onChange={(e) => {
                changeHandler(e);
              }}
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
                onClick={submitHandler}
              >
                Create
              </button>
            ) : (
              <button className="btn btn-disabled btn-sm">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
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

export default AddCategoryModal;
