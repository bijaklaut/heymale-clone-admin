"use client";

import { deletePayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PaymentTypes } from "../../../services/types";

interface thisProps {
  payment: PaymentTypes;
  index: number;
}

const DeletePaymentModal = (props: thisProps) => {
  const { payment, index } = props;
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
        className="btn btn-error btn-xs ms-1 text-white"
        onClick={() => modalHandler(`delPay${index}`, true)}
      >
        Delete
      </button>
      <dialog data-theme={"dracula"} id={`delPay${index}`} className="modal">
        <div className="modal-box">
          <h3 className=" mb-5 font-semibold text-primary">
            Are you sure to delete {payment.bankName} - {payment.accountNo}?
          </h3>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-xs"
              onClick={() => submitHandler(payment._id, index)}
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

export default DeletePaymentModal;
