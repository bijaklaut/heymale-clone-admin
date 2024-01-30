"use client";

import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { authSignout } from "../../services/actions";
import { simpleModalHandler } from "../../services/helper";

export const SignoutModal = () => {
  const [loading, setLoading] = useState(false);

  const signoutHandler = useCallback(async () => {
    try {
      setLoading(true);
      await authSignout();

      setTimeout(() => {
        setLoading(false);
        simpleModalHandler("logout", false);
        toast.success("Logged out", { containerId: "Signin" });
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        simpleModalHandler("logout", false);
        toast.error(error.message, { containerId: "Main" });
      }, 700);
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="w-full text-left"
        onClick={() => simpleModalHandler("logout", true)}
      >
        Log out
      </button>
      <dialog
        data-theme={"skies"}
        id={"logout"}
        className="modal pointer-events-none"
      >
        <div className="modal-box absolute flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to log out?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button className="btn btn-error btn-sm" onClick={signoutHandler}>
                Log out
              </button>
            ) : (
              <button className="btn btn-sm">
                <span className="loading loading-spinner loading-sm"></span>
                Logging out..
              </button>
            )}
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler("logout", false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
