"use client";

import { useEffect, useState } from "react";
import { createUser } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PostUserTypes, ValidationTypes } from "../../../services/types";
import Cookies from "js-cookie";
import { buttonCheck, populateValidation } from "../../../services/helper";
import TextInput from "../../Form/TextInput";

const initialData = () => {
  return { name: "", email: "", phoneNumber: "", password: "", confirm: "" };
};

interface ThisProps {
  stateChanges(): void;
}

const CreateUserModal = ({ stateChanges }: ThisProps) => {
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostUserTypes>(initialData());
  const [loading, setLoading] = useState(false);
  const btnCheckProps = {
    data,
    requiredField: ["name", "email", "phoneNumber", "confirm"],
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

  const submitHandler = async () => {
    const form = new FormData();
    setLoading(true);
    setValidation([]);

    if (data.password !== data.confirm) {
      return setValidation((prev) => [
        ...prev,
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

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        modalHandler("addUser", false);
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setLoading(false);
      setTimeout(() => {
        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "CreateUser" });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm w-fit"
        onClick={() => modalHandler("addUser", true)}
      >
        Add User
      </button>
      <dialog data-theme={"skies"} id="addUser" className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-xl text-white">
          <h3 className="modal-title mb-5">Add New User</h3>
          <div className="flex gap-x-3">
            <TextInput
              dataState={{ data, setData }}
              label={["Full Name", "name", "Enter full name"]}
              validations={validation}
            />
            <TextInput
              dataState={{ data, setData }}
              label={["Email", "email", "Enter email"]}
              validations={validation}
            />
          </div>
          <TextInput
            dataState={{ data, setData }}
            label={["Phone Number", "phoneNumber", "Enter phone number"]}
            validations={validation}
          />
          <div className="flex gap-x-3">
            <TextInput
              dataState={{ data, setData }}
              label={["Password", "password", "Enter password"]}
              type="password"
              validations={validation}
            />
            <TextInput
              dataState={{ data, setData }}
              label={["Confirm Password", "confirm", "Confirm password"]}
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
                onClick={() => modalHandler("addUser", false)}
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

export default CreateUserModal;
