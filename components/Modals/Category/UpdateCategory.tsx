"use client";

import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CategoryTypes,
  DataTypes,
  PostCategoryTypes,
  ValidationTypes,
} from "../../../services/types";
import { updateCategory } from "../../../services/admin";
import { EditSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import {
  buttonCheck,
  modalHandler,
  populateValidation,
} from "../../../services/helper";

interface thisProps {
  category: CategoryTypes;
  index: number;
  stateChanges(): void;
}

const initialData = (data: DataTypes | undefined) => {
  return { name: (data as CategoryTypes).name };
};

const UpdateCategoryModal = (props: thisProps) => {
  const router = useRouter();
  const { category, index, stateChanges } = props;
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostCategoryTypes>(initialData(category));
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const setState = { setDisable, setLoading, setValidation, setData };
  const btnCheckProps = {
    data,
    requiredField: ["name"],
    setDisable,
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
    setValidation([]);

    try {
      const token = Cookies.get("token");
      const result = await updateCategory(data, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler(
          `updateCat${index}`,
          false,
          initialData,
          setState,
          category,
        );
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        return toast.error(error.message, {
          containerId: "UpdateCategory",
        });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <Fragment>
      <button
        data-theme={"skies"}
        className="btn-icon-primary"
        onClick={() =>
          modalHandler(
            `updateCat${index}`,
            true,
            initialData,
            setState,
            category,
          )
        }
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
            label={["Category Name", "name", "Enter category name"]}
            data={data}
            changeHandler={textInputHandler}
            validations={validation}
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
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  modalHandler(
                    `updateCat${index}`,
                    false,
                    initialData,
                    setState,
                    category,
                  )
                }
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
