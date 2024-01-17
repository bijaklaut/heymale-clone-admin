"use client";

import { deleteUser } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserTypes } from "../../../services/types";
import Cookies from "js-cookie";
import { useState } from "react";
import { simpleModalHandler } from "../../../services/helper";
import { TrashSvg } from "../../Misc/SvgGroup";

interface thisProps {
  user: UserTypes;
  index: number;
  stateChanges(): void;
}

const DeleteUserModal = (props: thisProps) => {
  const { user, index, stateChanges } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (id: string, index: number) => {
    setLoading(true);

    try {
      const token = Cookies.get("token");
      const result = await deleteUser(id, token!);

      setTimeout(() => {
        setLoading(false);
        simpleModalHandler(`delUser${index}`, false);
        toast.success(result.message, { containerId: "Main" });
        router.refresh();
        stateChanges();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        simpleModalHandler(`delUser${index}`, false);
        toast.error(error.message, { containerId: "Main" });
      }, 700);
    }
  };

  return (
    <>
      <button
        data-theme={"skies"}
        className="btn-icon-error"
        onClick={() => simpleModalHandler(`delUser${index}`, true)}
      >
        <TrashSvg className="w-5 stroke-current" />
      </button>
      <dialog data-theme={"skies"} id={`delUser${index}`} className="modal">
        <div className="modal-box flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to delete this user
            <span className="text-error"> {` ${user.email} `}</span>?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button
                className="btn btn-error btn-sm"
                onClick={() => submitHandler(user._id, index)}
              >
                Delete
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                Deleting..
              </button>
            )}
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler(`delUser${index}`, false)}
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

export default DeleteUserModal;
