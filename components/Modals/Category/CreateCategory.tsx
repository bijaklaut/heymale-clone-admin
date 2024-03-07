"use client";

import { useEffect, useState } from "react";
import { createCategory } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import {
  buttonCheck,
  modalHandler,
  populateValidation,
} from "../../../services/helper";
import { PostCategoryTypes, ValidationTypes } from "../../../services/types";

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
  const setState = { setData, setLoading, setDisable, setValidation };
  const btnCheckProps = {
    data,
    requiredField: ["name"],
    setDisable,
  };

  const submitHandler = async () => {
    setLoading(true);
    setValidation([]);

    try {
      const result = await createCategory(data, true);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler("addCat", false, initialData, setState);
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "CreateCategory" });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm w-fit"
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
            dataState={{ data, setData }}
            label={["Category Name", "name", "Enter category name"]}
            validations={validation}
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
