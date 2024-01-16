"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { changePassword } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserTypes, ValidationTypes } from "../../../services/types";
import Cookies from "js-cookie";
import {
  buttonCheck,
  populateValidation,
  stateChanges,
} from "../../../services/helper";
import TextInput from "../../Form/TextInput";
import { KeySvg } from "../../Misc/SvgGroup";

interface thisProps {
  user: UserTypes;
  index: number;
  setChanges: Dispatch<SetStateAction<boolean>>;
}

const initialData = () => {
  return {
    oldPassword: "",
    newPassword: "",
    confirm: "",
  };
};

const ChangePasswordModal = (props: thisProps) => {
  const router = useRouter();
  const { user, index, setChanges } = props;
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState(initialData());
  const btnCheckProps = {
    data,
    requiredField: ["oldPassword", "newPassword", "confirm"],
    setDisable,
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (show) {
      setDisable(true);
      setData(initialData());
      setValidation([]);

      return modal.showModal();
    }

    modal.close();
  };

  const submitHandler = async (id: string, index: number) => {
    const form = new FormData();
    setLoading(true);
    setValidation([]);

    if (data.newPassword !== data.confirm) {
      return setValidation((prev) => [
        ...prev,
        {
          field: "confirm",
          message: "Password confirmation does not match",
        },
      ]);
    }

    form.append("oldPassword", data.oldPassword);
    form.append("newPassword", data.newPassword);

    try {
      const token = Cookies.get("token");
      const result = await changePassword(form, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        modalHandler(`cxPass${index}`, false);
        router.refresh();
        stateChanges(setChanges);
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        if (
          error.message == "Validation Error" ||
          error.message == "Invalid Password" ||
          error.message == "Existed Password"
        ) {
          return populateValidation(error, setValidation);
        }
        toast.error(error.message, { containerId: "ChangePass" });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-accent"
        onClick={() => modalHandler(`cxPass${index}`, true)}
      >
        <KeySvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`cxPass${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"ChangePass"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-xl text-white">
          <h3 className="modal-title mb-5">Change User Password</h3>
          <TextInput
            dataState={{ data, setData }}
            label={[
              "Current Password",
              "oldPassword",
              "Enter current password",
            ]}
            type="password"
            validations={validation}
          />
          <div className="flex gap-x-3">
            <TextInput
              dataState={{ data, setData }}
              label={["New Password", "newPassword", "Enter new password"]}
              type="password"
              validations={validation}
            />
            <TextInput
              dataState={{ data, setData }}
              label={[
                "Confirm New Password",
                "confirm",
                "Confirm new password",
              ]}
              type="password"
              validations={validation}
            />
          </div>
          {/* Submit */}
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-primary btn-sm"
                disabled={disable}
                onClick={() => submitHandler(user._id, index)}
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
              <button
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler(`cxPass${index}`, false)}
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

export default ChangePasswordModal;
