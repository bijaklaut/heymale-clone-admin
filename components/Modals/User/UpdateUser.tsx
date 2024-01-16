"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateUser } from "../../../services/admin";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  PostUserTypes,
  UserTypes,
  ValidationTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import {
  buttonCheck,
  populateValidation,
  stateChanges,
} from "../../../services/helper";
import TextInput from "../../Form/TextInput";
import { EditSvg } from "../../Misc/SvgGroup";

interface thisProps {
  user: UserTypes;
  index: number;
  setChanges: Dispatch<SetStateAction<boolean>>;
}

const initialData = (data: PostUserTypes) => {
  return {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
  };
};

const UpdateUserModal = (props: thisProps) => {
  const router = useRouter();
  const { user, index, setChanges } = props;
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [data, setData] = useState<PostUserTypes>(initialData(user));
  const btnCheckProps = {
    data,
    requiredField: ["name", "email", "phoneNumber", "confirm"],
    setDisable,
  };

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (show) {
      setDisable(true);
      setData(initialData(user));
      setValidation([]);
      return modal.showModal();
    }

    modal.close();
  };

  const submitHandler = async (id: string, index: number) => {
    const form = new FormData();
    setLoading(true);
    setValidation([]);

    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }

    try {
      const token = Cookies.get("token");
      const result = await updateUser(form, id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        modalHandler(`updateUser${index}`, false);
        router.refresh();
        stateChanges(setChanges);
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
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
        data-theme={"skies"}
        className="btn-icon-primary"
        onClick={() => modalHandler(`updateUser${index}`, true)}
      >
        <EditSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`updateUser${index}`} className="modal">
        <ToastContainer
          enableMultiContainer
          containerId={"CreateUser"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute max-w-xl text-white">
          <h3 className="modal-title mb-5">Update User</h3>
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
                onClick={() => modalHandler(`updateUser${index}`, false)}
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

export default UpdateUserModal;
