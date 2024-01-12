"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import { PopulateError } from "../../../services/helper";
import { PostCategoryTypes } from "../../../services/types";

const CreateCategoryModal = ({ stateChanges }: { stateChanges(): void }) => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostCategoryTypes>({
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
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (!show) {
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
    }

    return modal.showModal();
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
      const token = Cookies.get("token");
      const result = await createCategory(data, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler("addCat", false);
        router.refresh();
        return stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
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

        toast.error(error.message, { containerId: "CreateCategory" });
      }, 700);
    }
  };

  useEffect(() => {
    const buttonCheck = (data: { name: string }) => {
      if (!data.name) return setDisable(true);

      setDisable(false);
    };

    buttonCheck(data);
  }, [data]);

  useEffect(() => {
    PopulateError(validation, data);
  }, [validation]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => modalHandler("addCat", true)}
      >
        Add Category
      </button>
      <dialog data-theme={"skies"} id="addCat" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateCategory"}
          theme="dark"
        />
        <div className="modal-box absolute text-white">
          <h3 className="modal-title mb-5">Add Category</h3>
          <TextInput
            data={data}
            label={["Category Name", "name", "Enter category name"]}
            validation={validation}
            onChange={textInputHandler}
          />
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
                onClick={submitHandler}
              >
                Create
              </button>
            ) : (
              <button disabled className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-outline btn-sm"
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
