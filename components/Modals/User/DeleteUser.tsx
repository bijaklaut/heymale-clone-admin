"use client";

import { deleteUser } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserTypes } from "../../../services/types";
import Cookies from "js-cookie";

interface thisProps {
  user: UserTypes;
  index: number;
}

const DeleteUserModal = (props: thisProps) => {
  const { user, index } = props;
  const router = useRouter();

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (modal && show) {
      modal.showModal();
    } else if (modal && show == false) {
      modal.close();
    }
  };

  const submitHandler = async (id: string, index: number) => {
    const loading = toast.loading("Processing", { containerId: "Main" });
    try {
      const token = Cookies.get("token");
      const result = await deleteUser(id, token!);

      toast.update(loading, {
        render: result.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delUser${index}`, false);
      router.refresh();
    } catch (error: any) {
      toast.update(loading, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        containerId: "Main",
      });
      modalHandler(`delUser${index}`, false);
    }
  };

  return (
    <>
      <button
        className="btn btn-error btn-xs min-w-[75px] rounded-md text-white"
        onClick={() => modalHandler(`delUser${index}`, true)}
      >
        Delete
      </button>
      <dialog data-theme={"dracula"} id={`delUser${index}`} className="modal">
        <div className="modal-box">
          <h3 className=" mb-5 font-semibold text-primary">
            {`Are you sure to delete this user (${user.email})?`}
          </h3>
          <div className="modal-action flex">
            <button
              className="btn btn-primary btn-xs"
              onClick={() => submitHandler(user._id, index)}
            >
              Confirm
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-outline btn-xs">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteUserModal;
