"use client";

import { deletePayment } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PaymentTypes } from "../../../services/types";
import { TrashSvg } from "../../Misc/SvgGroup";
import { simpleModalHandler } from "../../../services/helper";
import { useState } from "react";
import Cookies from "js-cookie";

interface thisProps {
  payment: PaymentTypes;
  index: number;
  stateChanges(): void;
}

const DeletePaymentModal = (props: thisProps) => {
  const { payment, index, stateChanges } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);

    try {
      const result = await deletePayment(id, true);

      if (result.status >= 300) throw result;

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        simpleModalHandler(`delPay${index}`, false);
        router.refresh();
        return stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        simpleModalHandler(`delPay${index}`, false);
        toast.error(error.message, { containerId: "Main" });
      }, 700);
    }
  };

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-error"
        onClick={() => simpleModalHandler(`delPay${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>

      <dialog data-theme={"skies"} id={`delPay${index}`} className="modal">
        <div className="modal-box flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to delete
            <span className="text-error">{` ${payment.bankName} - ${payment.accountNo} `}</span>
            ?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-error btn-sm"
                onClick={() => submitHandler(payment._id, index)}
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
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler(`delCat${index}`, false)}
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

export default DeletePaymentModal;
