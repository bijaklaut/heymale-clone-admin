"use client";

import { deleteProduct } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ProductTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";
import Cookies from "js-cookie";
import { simpleModalHandler } from "../../../services/helper";
import { useState } from "react";

interface thisProps {
  product: ProductTypes;
  index: number;
  stateChanges(): void;
}

const DeleteProductModal = (props: thisProps) => {
  const { product, index, stateChanges } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const result = await deleteProduct(id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        simpleModalHandler(`delProd${index}`, false);
        router.refresh();
        return stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        simpleModalHandler(`delProd${index}`, false);
        toast.error(error.message, { containerId: "Main" });
      }, 700);
    }
  };

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-error"
        onClick={() => simpleModalHandler(`delProd${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`delProd${index}`} className="modal">
        <div className="modal-box flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to delete
            <span className="text-error">{` ${product.name} `}</span>?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-error btn-sm"
                onClick={() => submitHandler(product._id, index)}
              >
                Delete
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Deleting..
              </button>
            )}
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler(`delProd${index}`, false)}
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

export default DeleteProductModal;
