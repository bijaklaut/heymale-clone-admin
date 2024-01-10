"use client";

import { deleteCategory } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";
import { useState } from "react";

interface thisProps {
  category: CategoryTypes;
  index: number;
  stateChanges(): void;
}

const DeleteCategoryModal = (props: thisProps) => {
  const { category, index, stateChanges } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const loading = toast.loading("Processing..", {
      containerId: "DeleteCategory",
    });

    try {
      const result = await deleteCategory(id);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`delCat${index}`, false);
        setLoading(false);
        router.refresh();

        return stateChanges();
      }
    } catch (error: any) {
      setLoading(false);
      toast.update(loading, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delCat${index}`, false);
    }
  };

  return (
    <>
      <button
        className="text-gray-600 transition-all hover:text-error"
        onClick={() => modalHandler(`delCat${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"nord"} id={`delCat${index}`} className="modal">
        <div className="modal-box">
          <h3 className="mb-5 font-semibold">
            Are you sure to delete {`"${category.name}"`}?
          </h3>
          <div className="modal-action flex">
            {!loading ? "" : ""}
            <button
              className="btn btn-error btn-xs text-white"
              onClick={() => submitHandler(category._id, index)}
            >
              Delete
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-outline btn-xs">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteCategoryModal;
