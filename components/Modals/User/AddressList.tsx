"use client";

import { ToastContainer, toast } from "react-toastify";
import { AddressTypes, UserTypes } from "../../../services/types";
import { useRef, useState } from "react";
import { deleteAddress } from "../../../services/admin";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import PostAddressCollapse from "../../Collapse/Address/PostAddress";

interface thisProps {
  user: UserTypes;
  index: number;
}

const AddressListModal = (props: thisProps) => {
  const { user, index } = props;
  const { _id, addresses } = user;
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalShow, setModalShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(-1);
  const [data, setData] = useState<AddressTypes>();
  const [showUpdate, setShowUpdate] = useState(false);

  const modalHandler = (id: string, show: boolean) => {
    const checkbox = document.getElementById(id) as HTMLInputElement;

    if (checkbox && show) {
      checkbox.checked = true;
      return setModalShow(true);
    }

    checkbox.checked = false;
    return setModalShow(false);
  };
  const deleteHandler = async (id: string) => {
    const loading = toast.loading("Processing", { containerId: "AddressList" });
    try {
      const token = Cookies.get("token");
      const result = await deleteAddress(id, token!);

      toast.dismiss(loading);
      toast.success(result.message, {
        containerId: "AddressList",
      });

      setDeleteShow(-1);
      router.refresh();
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
      <label
        className="btn-xs min-w-[75px] rounded-md border-2 border-primary bg-transparent py-1 text-primary transition-all hover:bg-primary hover:text-white"
        onClick={() => modalHandler(`addressList${index}`, true)}
      >
        Address List
      </label>

      <input
        type="checkbox"
        id={`addressList${index}`}
        className="modal-toggle hidden"
      />
      <div data-theme={"nord"} className="modal" role="dialog">
        <ToastContainer
          enableMultiContainer
          containerId={"AddressList"}
          theme="dark"
        />
        <div
          id={`AddressList${index}`}
          ref={modalRef}
          className="no-scrollbar modal-box max-w-2xl py-8 text-start"
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
                  <div className="card-body px-7 py-5">
                    <div className="flex items-center">
                      <p className="card-title">{address.addressLabel}</p>
                      {address.asDefault ? (
                        <div className="badge badge-primary text-white">
                          Default
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="">
                      <span className="mr-2 font-semibold">Recipient:</span>
                      <p>{`${address.recipientName} - ${address.phone}`}</p>
                    </div>
                    <p>{address.address}</p>
                    <div className="flex flex-col">
                      <p className="mb-0 font-semibold">{address.city.name}</p>
                      <p className="font-semibold">{`${address.province.name} ${address.postcode}`}</p>
                      <p className="font-semibold"></p>
                    </div>
                    {deleteShow == i ? (
                      <div className="card-actions mt-7">
                        <div className="absolute bottom-0 left-0 flex w-full justify-between bg-error px-5 py-2 text-white">
                          <span>Are you sure to delete this address?</span>
                          <div>
                            <button
                              className="btn btn-outline btn-xs rounded-md border-2 text-white hover:border-white hover:bg-white hover:text-error"
                              onClick={() => deleteHandler(address._id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-xs ms-2 rounded-md text-error"
                              onClick={() => setDeleteShow(-1)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card-actions justify-end">
                        <button
                          className="btn btn-neutral btn-xs"
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
              <label
                className="btn btn-outline btn-sm"
                onClick={() => modalHandler(`addressList${index}`, false)}
              >
                Close
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressListModal;
