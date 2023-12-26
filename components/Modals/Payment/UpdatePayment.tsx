"use client";

import { useState } from "react";
import { updateCategory, updatePayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PaymentTypes } from "../../../services/types";

interface thisProps {
  payment: PaymentTypes;
  index: number;
}
const UpdatePaymentModal = (props: thisProps) => {
  const router = useRouter();
  const { payment, index } = props;
  const [data, setData] = useState({
    ownerName: payment.ownerName,
    bankName: payment.bankName,
    accountNo: payment.accountNo,
  });
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState({
    ownerName: {
      message: "",
    },
    bankName: {
      message: "",
    },
    accountNo: {
      message: "",
    },
  });

  const buttonCheck = () => {
    const { ownerName, bankName, accountNo } = data;

    if (!ownerName || !bankName || !accountNo) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      setDisable(true);
      setData({
        ownerName: payment.ownerName,
        bankName: payment.bankName,
        accountNo: payment.accountNo,
      });
      setValidation({
        ownerName: {
          message: "",
        },
        bankName: {
          message: "",
        },
        accountNo: {
          message: "",
        },
      });

      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const loading = toast.loading("Processing..", {
      containerId: "CreateProduct",
    });

    try {
      const result = await updatePayment(data, id);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`updatePay${index}`, false);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error") {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdatePay",
        });
        setValidation(error.errorDetail);
      } else if (error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdatePay",
        });
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdatePay",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-xs text-white"
        onClick={() => modalHandler(`updatePay${index}`, true)}
      >
        Update
      </button>
      <dialog data-theme={"dracula"} id={`updatePay${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"UpdatePay"}
          theme="dark"
        />
        <div className="modal-box">
          <h3 className=" mb-5 text-lg font-bold text-primary">
            Update Payment
          </h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Owner Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  ownerName: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.ownerName}
            />
            <div className="label">
              {validation.ownerName?.message ? (
                <span className="label-text-alt text-error">
                  {validation.ownerName?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Bank Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  bankName: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.bankName}
            />
            <div className="label">
              {validation.bankName?.message ? (
                <span className="label-text-alt text-error">
                  {validation.bankName?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Account Number</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  accountNo: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.accountNo}
            />
            <div className="label">
              {validation.accountNo?.message ? (
                <span className="label-text-alt text-error">
                  {validation.accountNo?.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </label>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-sm"
              disabled={disable}
              onClick={() => submitHandler(payment._id, index)}
            >
              Confirm
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-outline btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UpdatePaymentModal;
