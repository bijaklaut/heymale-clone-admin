"use client";

import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { updatePayment } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  DataTypes,
  PaymentTypes,
  ValidationTypes,
} from "../../../services/types";
import { EditSvg } from "../../Misc/SvgGroup";
import TextInput from "../../Form/TextInput";
import Cookies from "js-cookie";
import {
  buttonCheck,
  modalHandler,
  populateValidation,
  textInputHandler,
} from "../../../services/helper";

interface thisProps {
  payment: PaymentTypes;
  index: number;
  stateChanges(): void;
}

const initialData = (data?: DataTypes | undefined) => {
  return {
    ownerName: (data as PaymentTypes)?.ownerName || "",
    bankName: (data as PaymentTypes)?.bankName || "",
    accountNo: (data as PaymentTypes)?.accountNo || "",
  };
};

const UpdatePaymentModal = (props: thisProps) => {
  const router = useRouter();
  const { payment, index, stateChanges } = props;
  const [data, setData] = useState(initialData());
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const setState = { setData, setDisable, setLoading, setValidation };
  const btnCheckProps = {
    data,
    requiredField: ["ownerName", "bankName", "accountNo"],
    setDisable,
  };

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);
    setValidation([]);

    try {
      const token = Cookies.get("token");
      const result = await updatePayment(data, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, {
          containerId: "Main",
        });
        modalHandler(
          `updatePay${index}`,
          false,
          initialData,
          setState,
          payment,
        );
        router.refresh();

        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        return toast.error(error.message, { containerId: "UpdatePay" });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <Fragment>
      <button
        data-theme={"skies"}
        className="btn-icon-primary"
        onClick={() =>
          modalHandler(
            `updatePay${index}`,
            true,
            initialData,
            setState,
            payment,
          )
        }
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`updatePay${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"UpdatePay"}
          theme="dark"
        />
        <div className="modal-box absolute text-white">
          <h3 className="modal-title mb-5">Update Payment</h3>
          <TextInput
            dataState={{ data, setData }}
            label={["Owner Name", "ownerName", "Enter account owner name"]}
            validations={validation}
          />
          <TextInput
            dataState={{ data, setData }}
            label={["Bank Name", "bankName", "Enter bank name"]}
            validations={validation}
          />
          <TextInput
            dataState={{ data, setData }}
            label={["Account Number", "accountNo", "Enter account number"]}
            validations={validation}
          />
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
                onClick={() => submitHandler(payment._id, index)}
              >
                Update
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Updating..
              </button>
            )}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  modalHandler("addPay", false, initialData, setState, payment)
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

export default UpdatePaymentModal;
