"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { updatePayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PaymentTypes, PostPaymentTypes } from "../../../services/types";
import { EditSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";

interface thisProps {
  payment: PaymentTypes;
  index: number;
  stateChanges(): void;
}

const UpdatePaymentModal = (props: thisProps) => {
  const router = useRouter();
  const { payment, index, stateChanges } = props;
  const [data, setData] = useState(payment);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);

  const textInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputLabel: string,
  ) => {
    setData({
      ...data,
      [inputLabel]: event.target.value,
    });
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      return modal.showModal();
    }

    setDisable(true);
    setLoading(false);
    setData(payment);
    setValidation([{ field: "", message: "" }]);

    return modal.close();
  };

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);
    try {
      const token = Cookies.get("token");
      const result = await updatePayment(data, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler(`updatePay${index}`, false);
        router.refresh();

        stateChanges();
      }, 1000);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          for (const [key] of Object.entries(error.errorDetail)) {
            setValidation((prev) => [
              ...prev,
              {
                field: key,
                message: error.errorDetail[key].message,
              },
            ]);
          }
        }

        return toast.error(error.message, { containerId: "CreatePayment" });
      }, 1000);
    }
  };

  useEffect(() => {
    const buttonCheck = (data: PostPaymentTypes) => {
      const { accountNo, ownerName, bankName } = data;

      if (!accountNo || !ownerName || !bankName) return setDisable(true);

      setDisable(false);
    };

    buttonCheck(data);
  }, [data]);

  return (
    <>
      <button
        className="text-gray-600 transition-all hover:text-blue-500"
        onClick={() => modalHandler(`updatePay${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"dracula"} id={`updatePay${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"UpdatePay"}
          theme="dark"
        />
        <div className="modal-box absolute text-white">
          <h3 className=" mb-5 text-lg font-bold text-sky-500">
            Update Payment
          </h3>

          <TextInput
            data={data}
            label={["Owner Name", "ownerName", "Enter account owner name"]}
            onChange={textInputHandler}
            validation={validation}
          />
          <TextInput
            data={data}
            label={["Bank Name", "bankName", "Enter bank name"]}
            onChange={textInputHandler}
            validation={validation}
          />
          <TextInput
            data={data}
            label={["Account Number", "accountNo", "Enter account number"]}
            onChange={textInputHandler}
            validation={validation}
          />
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-sm bg-sky-500 px-8 text-white hover:bg-sky-600 active:bg-sky-600"
                disabled={disable}
                onClick={() => submitHandler(payment._id, index)}
              >
                Update
              </button>
            ) : (
              <button className="btn-sky-500 btn btn-sm pointer-events-none text-white">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm border-white bg-transparent px-5 text-white hover:bg-white hover:text-slate-800 active:bg-white active:text-slate-800 "
                onClick={() => modalHandler("addPay", false)}
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

export default UpdatePaymentModal;
