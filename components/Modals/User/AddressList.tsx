"use client";

import { ToastContainer, toast } from "react-toastify";
import { AddressTypes, UserTypes } from "../../../services/types";
import { useRef, useState } from "react";
import { deleteAddress } from "../../../services/admin";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import PostAddressCollapse from "../../Collapse/Address/PostAddress";
import { HomeSvg } from "../../Misc/SvgGroup";

interface thisProps {
  user: UserTypes;
  index: number;
  stateChanges(): void;
}

const AddressListModal = (props: thisProps) => {
  const { user, index, stateChanges } = props;
  const { _id, addresses } = user;
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalShow, setModalShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(-1);
  const [data, setData] = useState<AddressTypes>();
  const [showUpdate, setShowUpdate] = useState(false);

  const modalHandler = (id: string, show: boolean) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    // Prevent modal closed via escape button
    modal.addEventListener("cancel", (e) => {
      e.preventDefault();
    });

    if (show) {
      modal.showModal();
      return setModalShow(true);
    }

    setDeleteShow(-1);
    modal.close();
    return setModalShow(false);
  };

  const deleteHandler = async (id: string) => {
    const loading = toast.loading("Processing", { containerId: "AddressList" });
    try {
      const token = Cookies.get("token");
      const result = await deleteAddress(id, token!);

      toast.dismiss(loading);
      toast.success(result.message, {
        containerId: "Main",
      });

      setDeleteShow(-1);
      router.refresh();
      stateChanges();
    } catch (error: any) {
      toast.dismiss(loading);
      toast.error(error.message, {
        containerId: "AddressList",
      });

      setDeleteShow(-1);
    }
  };

  const reset = () => {
    setShowUpdate(false);
  };

  const updateMisc = (address: AddressTypes) => {
    setShowUpdate(!showUpdate);
    setData(address);

    if (modalRef.current) {
      modalRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };
  return (
    <>
      <button
        data-theme="skies"
        className="btn-icon-success bg-transparent md:btn md:btn-success md:btn-xs xl:btn-sm md:bg-inherit md:p-0 md:px-2 md:text-success md:hover:text-white"
        onClick={() => modalHandler(`addressList${index}`, true)}
      >
        <HomeSvg className="w-6 stroke-current md:hidden" />
        <span className="hidden md:inline ">Address List</span>
      </button>
      <dialog
        data-theme={"nord"}
        id={`addressList${index}`}
        className="modal overflow-hidden"
      >
        <ToastContainer
          enableMultiContainer
          containerId={"AddressList"}
          theme="dark"
        />
        <div
          ref={modalRef}
          className="no-scrollbar modal-box absolute right-1/2 max-w-2xl translate-x-1/2 px-4 py-8 text-start sm:px-8"
        >
          <button
            className="btn btn-circle btn-ghost absolute right-4 top-4 text-lg"
            onClick={() => modalHandler(`addressList${index}`, false)}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-primary">Address List</h3>

          {addresses.length < 5 ? (
            <PostAddressCollapse
              id={_id}
              modalShow={modalShow}
              address={data!}
              centered={addresses.length == 0}
              showUpdate={showUpdate}
              reset={reset}
              stateChanges={stateChanges}
            />
          ) : (
            <div className="mt-10"></div>
          )}

          <div className="z-10 flex flex-wrap justify-evenly gap-y-5">
            {addresses.map((address, i) => {
              return (
                <div
                  key={i}
                  className="card relative z-10 w-full overflow-hidden border-2 border-neutral shadow-md"
                >
                  <div className="card-body px-3 py-4 sm:px-7 sm:py-5">
                    <div className="mb-3 flex items-center">
                      <p className="card-title text-base">
                        {address.addressLabel}
                      </p>
                      {address.asDefault ? (
                        <div
                          data-theme={"skies"}
                          className="badge badge-accent badge-sm text-white"
                        >
                          Default
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Recipient:</span>
                      <p className="text-sm">{`${address.recipientName} - ${address.phone}`}</p>
                    </div>
                    <p className="mt-3 text-sm">{address.address}</p>
                    <div className="mb-7 flex flex-col">
                      <p className="mb-0 font-semibold">{address.city.name}</p>
                      <p className="font-semibold">{`${address.province.name} ${address.postcode}`}</p>
                    </div>
                    {deleteShow == i ? (
                      <div className="card-actions mt-7">
                        <div
                          data-theme={"skies"}
                          className="absolute bottom-0 left-0 flex w-full flex-col justify-between gap-y-2 px-5 py-2 text-center text-white sm:flex-row sm:items-center sm:text-start"
                        >
                          <span>Are you sure to delete this address?</span>
                          <div className="flex w-full justify-center gap-x-1 sm:w-fit">
                            <button
                              className="btn btn-error btn-xs"
                              onClick={() => deleteHandler(address._id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-ghost btn-xs z-10"
                              onClick={() => setDeleteShow(-1)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        data-theme={"skies"}
                        className="card-actions justify-center bg-transparent sm:justify-end"
                      >
                        <button
                          className="btn btn-xs text-white"
                          onClick={() => {
                            updateMisc(address);
                          }}
                        >
                          Edit Address
                        </button>
                        <button
                          className="btn btn-error btn-xs text-white"
                          onClick={() => setDeleteShow(i)}
                        >
                          Delete Address
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!addresses.length && (
              <div className="mt-5 flex h-fit w-full items-center justify-center text-base italic">
                {`There is no address to display`}
              </div>
            )}
          </div>
          <div className="modal-action">
            {addresses.length != 0 && (
              <form method="dialog">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => modalHandler(`addressList${index}`, false)}
                >
                  Close
                </button>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AddressListModal;
