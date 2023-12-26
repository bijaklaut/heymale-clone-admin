"use client";

import { deleteCategory } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CategoryTypes } from "../../../services/types";

interface thisProps {
  category: CategoryTypes;
  index: number;
}

const DeleteCategoryModal = (props: thisProps) => {
  const { category, index } = props;
  const router = useRouter();

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
        router.refresh();
      }
    } catch (error: any) {
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
        className="btn btn-error btn-xs text-white "
        onClick={() => modalHandler(`delCat${index}`, true)}
      >
        Delete
      </button>
      <dialog data-theme={"dracula"} id={`delCat${index}`} className="modal">
        <div className="modal-box">
          <h3 className=" mb-5 font-semibold text-primary">
            Are you sure to delete {`"${category.name}"`}?
          </h3>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-xs"
              onClick={() => submitHandler(category._id, index)}
            >
              Confirm
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
