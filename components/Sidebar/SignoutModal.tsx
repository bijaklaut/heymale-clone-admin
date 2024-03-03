"use client";

import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import { simpleModalHandler } from "../../services/helper";
import axios from "axios";
import { useRouter } from "next/navigation";

export const SignoutModal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signoutHandler = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios({
        url: "/api/signout",
        method: "POST",
      });
      setTimeout(() => {
        setLoading(false);
        simpleModalHandler("logout", false);
        toast.success(data.message, { containerId: "Main" });
        router.push("/signin");
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
        Sign out
      </button>
      <dialog
        data-theme={"skies"}
        id={"logout"}
        className="modal pointer-events-none"
      >
        <div className="modal-box absolute flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to sign out?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button className="btn btn-error btn-sm" onClick={signoutHandler}>
                Sign out
              </button>
            ) : (
              <button className="btn btn-sm">
                <span className="loading loading-spinner loading-sm"></span>
                Signing out..
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
