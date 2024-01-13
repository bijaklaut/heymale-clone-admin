"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import {
  populateError,
  buttonCheck,
  modalHandler,
  populateValidation,
} from "../../../services/helper";
import {
  PostCategoryTypes,
  SetStateTypes,
  ValidationTypes,
} from "../../../services/types";

const initialData = () => {
  return {
    name: "",
  };
};

const CreateCategoryModal = ({ stateChanges }: { stateChanges(): void }) => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostCategoryTypes>(initialData());
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const setState: SetStateTypes = {
    setData,
    setLoading,
    setDisable,
    setValidation,
  };

  const textInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputLabel: string,
  ) => {
    setData({
      ...data,
      [inputLabel]: event.target.value,
    });
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
        modalHandler("addCat", false, initialData, setState);
        router.refresh();
        return stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "CreateCategory" });
      }, 700);
    }
  };

  // Button Check
  useEffect(() => {
    buttonCheck(data, ["name"], setDisable);
  }, [data]);

  // Populating validation error
  useEffect(() => {
    populateError(validation, data);
  }, [validation]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => modalHandler("addCat", true, initialData, setState)}
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
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
              </button>
            )}

            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  modalHandler("addCat", false, initialData, setState)
                }
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
