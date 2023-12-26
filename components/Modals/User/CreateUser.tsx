"use client";

import { useState } from "react";
import { createUser } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PostUserTypes } from "../../../services/types";
import Cookies from "js-cookie";

const CreateUserModal = () => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState<PostUserTypes>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");

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
      setDisable(true);
      setData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
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

  const submitHandler = async () => {
    const form = new FormData();
    const loading = toast.loading("Processing..", {
      containerId: "CreateUser",
    });

    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    if (data.password !== confirm) {
      return setValidation([
        ...validation,
        {
          field: "confirm",
          message: "Password confirmation doesn't match",
        },
      ]);
    }

    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }

    try {
      const token = Cookies.get("token");
      const result = await createUser(form, token!);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "Main",
        });

        modalHandler("addUser", false);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error" || error.code == 11000) {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "CreateUser",
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
          containerId: "CreateUser",
        });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm mb-3 mt-5 "
        onClick={() => modalHandler("addUser", true)}
      >
        Add User
      </button>
      <dialog data-theme={"dracula"} id="addUser" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="modal-box max-w-4xl">
          <h3 className=" mb-5 text-lg font-bold text-primary">Add New User</h3>
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Full Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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
          <label className="w-full max-w-xs">
            <div className="label">
              <span className="label-text -ms-1">Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
              onChange={(e) => {
                setData({
                  ...data,
                  password: e.target.value,
                });
              }}
              onKeyUp={buttonCheck}
              value={data.password}
            />
            <div className="label">
              {validation.map((val, key) => {
                if (val.field == "password") {
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
              className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 focus:outline-0 focus:ring-0"
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

export default CreateUserModal;
