"use client";

import { useState } from "react";
import { createPayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ThisProps {
  stateChanges(): void;
}

const CreatePaymentModal = (props: ThisProps) => {
  const { stateChanges } = props;
  const router = useRouter();
  const [data, setData] = useState({
    ownerName: "",
    bankName: "",
    accountNo: "",
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
        ownerName: "",
        bankName: "",
        accountNo: "",
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

  const submitHandler = async () => {
    const loading = toast.loading("Processing..", {
      containerId: "CreatePayment",
    });

    try {
      const result = await createPayment(data);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler("addPay", false);
        router.refresh();
        return stateChanges();
      }
    } catch (error: any) {
      if (error.message == "Validation Error") {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreatePayment",
        });
        setValidation(error.errorDetail);
      } else if (error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreatePayment",
        });
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreatePayment",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm mb-3 mt-5 "
        onClick={() => modalHandler("addPay", true)}
      >
        Add Payment
      </button>
      <dialog data-theme={"dracula"} id="addPay" className="modal">
        <ToastContainer
          theme="dark"
          enableMultiContainer
          containerId={"CreatePayment"}
        />
        <div className="modal-box">
          <h3 className=" mb-5 text-lg font-bold text-primary">
            Create New Payment
          </h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Owner Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
              onClick={submitHandler}
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

export default CreatePaymentModal;
