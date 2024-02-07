"use client";

import { deleteUser, deleteVoucher } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserTypes, VoucherTypes } from "../../../services/types";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { simpleModalHandler } from "../../../services/helper";
import { TrashSvg } from "../../Misc/SvgGroup";

interface thisProps {
  stateChanges(): void;
  isDelete: boolean;
  deleteItem?: VoucherTypes;
  reset(): void;
}

const initData = (voucher?: VoucherTypes) => {
  if (voucher) {
    return {
      id: voucher._id,
      voucherName: voucher.voucherName,
    };
  }

  return {
    id: "",
    voucherName: "",
  };
};

const DeleteVoucherModal = (props: thisProps) => {
  const { stateChanges, isDelete, deleteItem, reset } = props;
  const router = useRouter();
  const [voucher, setVoucher] = useState(initData());
  const [loading, setLoading] = useState(false);

  const submitHandler = useCallback(async () => {
    if (voucher) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const result = await deleteVoucher(voucher.id, token!);

        setTimeout(() => {
          setLoading(false);
          simpleModalHandler("deleteVoucher", false);
          toast.success(result.message, { containerId: "Main" });
          router.refresh();
          stateChanges();
        }, 700);
      } catch (error: any) {
        setTimeout(() => {
          setLoading(false);
          simpleModalHandler("deleteVoucher", false);
          toast.error(error.message, { containerId: "Main" });
        }, 700);
      }
    }
  }, [voucher]);

  useEffect(() => {
    if (isDelete) {
      simpleModalHandler("deleteVoucher", true);
      setVoucher(initData(deleteItem));
      reset();
    }
  }, [isDelete]);

  return (
    <>
      <dialog data-theme={"skies"} id={"deleteVoucher"} className="modal">
        <div className="modal-box flex flex-col items-center px-5 py-8">
          <h3 className="mb-3 text-center text-base font-semibold text-white">
            Are you sure to delete
            <span className="text-error">{` ${voucher.voucherName} `}</span>?
          </h3>
          <div className="modal-action flex">
            {!loading ? (
              <button className="btn btn-error btn-sm" onClick={submitHandler}>
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
                onClick={() => simpleModalHandler("deleteVoucher", false)}
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

export default DeleteVoucherModal;
