"use client";

import { deletePayment } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PaymentTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";

interface thisProps {
  payment: PaymentTypes;
  index: number;
  stateChanges(): void;
}

const DeletePaymentModal = (props: thisProps) => {
  const { payment, index, stateChanges } = props;
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
    const loading = toast.loading("Processing", {
      containerId: "Main",
    });

    try {
      const result = await deletePayment(id);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`delPay${index}`, false);
        router.refresh();
        return stateChanges();
      }
    } catch (error: any) {
      toast.update(loading, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delPay${index}`, false);
    }
  };

  return (
    <>
      <button
        className="error-icon-btn"
        onClick={() => modalHandler(`delPay${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>

      <dialog data-theme={"dracula"} id={`delPay${index}`} className="modal">
        <div className="modal-box">
          <h3 className=" mb-5 font-semibold text-white">
            Are you sure to delete {payment.bankName} - {payment.accountNo}?
          </h3>
          <div className="modal-action flex">
            <button
              className="error-btn"
              onClick={() => submitHandler(payment._id, index)}
            >
              Delete
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="outline-white-btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeletePaymentModal;
