"use client";

import { useState } from "react";
import { changePassword } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserTypes } from "../../../services/types";
import Cookies from "js-cookie";

interface thisProps {
  user: UserTypes;
  index: number;
}

const ChangePasswordModal = (props: thisProps) => {
  const router = useRouter();
  const { user, index } = props;
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [confirm, setConfirm] = useState("");

  const buttonCheck = () => {
    const { newPassword } = data;

    if (!newPassword || !confirm) {
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
        newPassword: "",
        oldPassword: "",
      });
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);
      setConfirm("");

      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const loading = toast.loading("Processing..", {
      containerId: "ChangePass",
    });
    const form = new FormData();
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    if (data.newPassword !== confirm) {
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

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler(`cxPass${index}`, false);
        router.refresh();
      }
    } catch (error: any) {
      if (
        error.message == "Validation Error" ||
        error.message == "Invalid Password" ||
        error.message == "Existed Password"
      ) {
        toast.dismiss(loading);
        for (const [key] of Object.entries(error.errorDetail)) {
          setValidation((prev) => [
            ...prev,
            {
              field: key,
              message: error.errorDetail[key].message,
            },
          ]);
        }
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "ChangePass",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-success btn-xs min-w-[75px] rounded-md text-white"
        onClick={() => modalHandler(`cxPass${index}`, true)}
      >
        Change Password
      </button>
      <dialog data-theme={"dracula"} id={`cxPass${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"ChangePass"}
          theme="dark"
        />
        <div className="modal-box max-w-4xl">
          <h3 className=" mb-5 text-lg font-bold text-primary">Add New User</h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Current Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  oldPassword: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.oldPassword}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "oldPassword") {
                  return (
                    <span key={key} className="label-text-alt text-error">
                      {val.message}
                    </span>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          </label>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">New Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  newPassword: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.newPassword}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "newPassword") {
                  return (
                    <span key={key} className="label-text-alt text-error">
                      {val.message}
                    </span>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          </label>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Confirm Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setConfirm(e.target.value);
              }}
              onKeyUp={buttonCheck}
              value={confirm}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "confirm") {
                  return (
                    <span key={key} className="label-text-alt text-error">
                      {val.message}
                    </span>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          </label>

          {/* Submit */}
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-sm"
              disabled={disable}
              onClick={async () => await submitHandler(user._id, index)}
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

export default ChangePasswordModal;
