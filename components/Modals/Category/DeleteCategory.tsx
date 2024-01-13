"use client";

import { deleteCategory } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";
import { useState } from "react";
import Cookies from "js-cookie";
import { simpleModalHandler } from "../../../services/helper";

interface thisProps {
  category: CategoryTypes;
  index: number;
  stateChanges(): void;
}

const DeleteCategoryModal = (props: thisProps) => {
  const { category, index, stateChanges } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const result = await deleteCategory(id, token!);

      setTimeout(() => {
        toast.success(result.message, {
          containerId: "Main",
        });

        simpleModalHandler(`delCat${index}`, false);
        setLoading(false);
        router.refresh();

        return stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        toast.error(error.message, {
          containerId: "Main",
        });
        simpleModalHandler(`delCat${index}`, false);
      }, 700);
    }
  };

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-error"
        onClick={() => simpleModalHandler(`delCat${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`delCat${index}`} className="modal">
        <div className="modal-box flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-base text-white">
            Are you sure to delete {category.name}?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-error btn-sm"
                onClick={() => submitHandler(category._id, index)}
              >
                Delete
              </button>
            ) : (
              <button className="btn btn-error btn-sm">
                <span className="loading loading-spinner loading-sm"></span>
                Deleting..
              </button>
            )}
            <form method="dialog">
              <button
                onClick={() => simpleModalHandler(`delCat${index}`, false)}
                className="btn btn-outline btn-sm"
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

export default DeleteCategoryModal;
