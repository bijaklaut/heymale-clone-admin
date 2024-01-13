"use client";

import { ChangeEvent, Fragment, useState } from "react";
import { createPayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TextInput from "../../Form/TextInput";
import { ValidationTypes } from "../../../services/types";
import Cookies from "js-cookie";
import {
  buttonCheck,
  modalHandler,
  populateValidation,
} from "../../../services/helper";

interface ThisProps {
  stateChanges(): void;
}

const initialData = () => {
  return {
    ownerName: "",
    bankName: "",
    accountNo: "",
  };
};

const CreatePaymentModal = (props: ThisProps) => {
  const { stateChanges } = props;
  const router = useRouter();
  const [data, setData] = useState(initialData());
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const setState = { setDisable, setData, setLoading, setValidation };
  const btnCheckProps = {
    data,
    requiredField: ["ownerName", "bankName", "accountNo"],
    setDisable,
  };

  const textInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputLabel: string,
  ) => {
    setData({
      ...data,
      [inputLabel]: event.target.value,
    });
  };

  const submitHandler = async () => {
    setLoading(true);
    setValidation([]);

    try {
      const token = Cookies.get("token");
      const result = await createPayment(data, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler("addPay", false, initialData, setState);
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        return toast.error(error.message, { containerId: "CreatePayment" });
      }, 700);
    }
  };

  return (
    <Fragment>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => modalHandler("addPay", true, initialData, setState)}
      >
        Add Payment
      </button>
      <dialog data-theme={"skies"} id="addPay" className="modal">
        <ToastContainer
          theme="dark"
          enableMultiContainer
          containerId={"CreatePayment"}
        />
        <div className="modal-box absolute text-white">
          <h3 className="modal-title mb-5">Create New Payment</h3>
          <TextInput
            data={data}
            label={["Owner Name", "ownerName", "Enter account owner name"]}
            changeHandler={textInputHandler}
            onKeyUp={() => buttonCheck(btnCheckProps)}
            validations={validation}
          />
          <TextInput
            data={data}
            label={["Bank Name", "bankName", "Enter bank name"]}
            changeHandler={textInputHandler}
            onKeyUp={() => buttonCheck(btnCheckProps)}
            validations={validation}
          />
          <TextInput
            data={data}
            label={["Account Number", "accountNo", "Enter account number"]}
            changeHandler={textInputHandler}
            onKeyUp={() => buttonCheck(btnCheckProps)}
            validations={validation}
          />
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
                onClick={submitHandler}
              >
                Create
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Creating..
              </button>
            )}

            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  modalHandler("addPay", false, initialData, setState)
                }
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </Fragment>
  );
};

export default CreatePaymentModal;
