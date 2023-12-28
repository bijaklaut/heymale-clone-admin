"use client";

import { ChangeEvent, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddCategoryModal = () => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
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
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);
    setData({
      name: "",
    });

    if (modal && show) {
      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: event.target.value,
    });

    if (!event.target.value) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const submitHandler = async () => {
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
        router.refresh();
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
        return toast.error(error.message, { containerId: "CreateCategory" });
      }

      toast.error(error.message, { containerId: "CreateCategory" });
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
      <dialog data-theme={"nord"} id="addCat" className="modal">
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
              placeholder="Enter category name"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-primary-content focus:outline-0 focus:ring-0"
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
