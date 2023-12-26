"use client";

import { useState } from "react";
import { updateUser } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PostUserTypes, UserTypes } from "../../../services/types";
import Cookies from "js-cookie";

interface thisProps {
  user: UserTypes;
  index: number;
}
const UpdateUserModal = (props: thisProps) => {
  const router = useRouter();
  const { user, index } = props;
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState<PostUserTypes>({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  const buttonCheck = () => {
    const { name, email, phoneNumber } = data;

    if (!name || !email || !phoneNumber) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      setData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);

      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }

    const loading = toast.loading("Processing..", {
      containerId: "UpdateUser",
    });

    try {
      const token = Cookies.get("token");
      const result = await updateUser(form, id, token!);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, { containerId: "Main" });

        modalHandler(`updateUser${index}`, false);
        router.refresh();
      }
    } catch (error: any) {
      setValidation([
        {
          field: "",
          message: "",
        },
      ]);
      if (error.message == "Validation Error" || error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "UpdateUser",
        });

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
          containerId: "UpdateUser",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-xs min-w-[75px] rounded-md text-white"
        onClick={() => modalHandler(`updateUser${index}`, true)}
      >
        Update
      </button>
      <dialog
        data-theme={"dracula"}
        id={`updateUser${index}`}
        className="modal"
      >
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="modal-box max-w-4xl">
          <h3 className=" mb-5 text-lg font-bold text-primary">Update User</h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Full Name</span>
            </div>
            <input
              type="text"
              placeholder={user.name}
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  name: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.name}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "name") {
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
              <span className="label-text -ms-1">Email</span>
            </div>
            <input
              type="email"
              placeholder={user.email}
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  email: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.email}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "email") {
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
              <span className="label-text -ms-1">Phone Number</span>
            </div>
            <input
              type="tel"
              placeholder={user.phoneNumber}
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  phoneNumber: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.phoneNumber}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "phoneNumber") {
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

export default UpdateUserModal;
