"use client";

import { Fragment, useEffect, useState } from "react";
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
import SelectInput from "../../Form/SelectInput";

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

const banks = [
  { _id: "bca", name: "BCA" },
  { _id: "bni", name: "BNI" },
  { _id: "bri", name: "BRI" },
  {
    _id: "mandiri",
    name: "Mandiri",
  },
];

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

  const submitHandler = async () => {
    setLoading(true);
    setValidation([]);

    try {
      const result = await createPayment(data, true);

      if (result.status >= 300) throw result;

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

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <Fragment>
      <button
        className="btn btn-primary btn-sm w-fit"
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
        <div className="no-scrollbar modal-box absolute max-w-xl text-white">
          <h3 className="modal-title mb-5">Create New Payment</h3>
          <TextInput
            dataState={{ data, setData }}
            label={["Owner Name", "ownerName", "Enter account owner name"]}
            validations={validation}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-3">
            <SelectInput
              dataState={{ data, setData }}
              label={["Bank Name", "bankName", "Enter bank name"]}
              selectionData={banks}
              validations={validation}
            />
            <TextInput
              dataState={{ data, setData }}
              label={["Account Number", "accountNo", "Enter account number"]}
              validations={validation}
            />
          </div>
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
