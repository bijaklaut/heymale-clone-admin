"use client";

import { ChangeEvent, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TextInput from "../../Form/TextInput";

const CreateCategoryModal = ({ stateChanges }: { stateChanges(): void }) => {
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

  const textInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputLabel: string,
  ) => {
    setData({
      ...data,
      [inputLabel]: event.target.value,
    });
    buttonCheck(event);
  };

  const buttonCheck = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!event.target.value) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      return modal.showModal();
    }
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);
    setData({
      name: "",
    });
    setDisable(true);
    setLoading(false);

    return modal.close();
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

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler("addCat", false);
        router.refresh();
        return stateChanges();
      }, 1000);
    } catch (error: any) {
      setTimeout(() => setLoading(false), 1000);

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
        <div className="modal-box absolute bg-slate-800 [&>*:not(h3)]:text-slate-800">
          <h3 className=" mb-5 text-lg font-bold text-white">Add Category</h3>
          <TextInput
            data={data}
            label={["Category Name", "name", "Enter category name"]}
            validation={validation}
            onChange={textInputHandler}
          />

          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm px-8 text-white"
                disabled={disable}
                onClick={submitHandler}
              >
                Create
              </button>
            ) : (
              <button className="btn btn-primary btn-sm pointer-events-none text-white">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm border-white bg-transparent text-white hover:bg-white hover:text-slate-800 active:bg-white active:text-slate-800 "
                onClick={() => modalHandler("addCat", false)}
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

export default CreateCategoryModal;
