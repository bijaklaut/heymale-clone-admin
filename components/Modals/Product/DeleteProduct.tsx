"use client";

import { deleteProduct } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ProductTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";

interface thisProps {
  product: ProductTypes;
  index: number;
}

const DeleteProductModal = (props: thisProps) => {
  const { product, index } = props;
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
    const loading = toast.loading("Processing", { containerId: "Main" });
    try {
      const result = await deleteProduct(id);

      toast.update(loading, {
        render: result.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delProd${index}`, false);
      router.refresh();
    } catch (error: any) {
      toast.update(loading, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delProd${index}`, false);
    }
  };

  return (
    <>
      <button
        className="text-gray-600 transition-all hover:text-error"
        onClick={() => modalHandler(`delProd${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"dracula"} id={`delProd${index}`} className="modal">
        <div className="modal-box">
          <h3 className=" mb-5 font-semibold text-primary">
            Are you sure to delete {product.name}?
          </h3>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-xs"
              onClick={() => submitHandler(product._id, index)}
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

export default DeleteProductModal;
