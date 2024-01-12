"use client";

import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes, PostCategoryTypes } from "../../../services/types";
import { updateCategory } from "../../../services/admin";
import { EditSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import { PopulateError } from "../../../services/helper";

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
  const [data, setData] = useState<PostCategoryTypes>({
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

    if (!show) {
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);
      setData({
        name: category.name,
      });
      setDisable(true);
      setLoading(false);

      return modal.close();
    }

    return modal.showModal();
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

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    try {
      const token = Cookies.get("token");
      const result = await updateCategory(data, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler(`updateCat${index}`, false);
        router.refresh();
        return stateChanges();
      }, 700);
      if (result.payload) {
        toast.success(result.message, {
          containerId: "Main",
        });

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
    <Fragment>
      <button
        data-theme={"skies"}
        className="btn-icon-primary"
        onClick={() => modalHandler(`updateCat${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`updateCat${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"UpdateCategory"}
          theme="dark"
        />
        <div className="modal-box absolute text-white">
          <h3 className="modal-title mb-5">Update Category</h3>
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
                onClick={() => submitHandler(category._id, index)}
              >
                Update
              </button>
            ) : (
              <button disabled className="primary-btn pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler(`updateCat${index}`, false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </Fragment>
  );
};

export default UpdateCategoryModal;
