"use client";

import { ToastContainer, toast } from "react-toastify";
import { AddressTypes, UserTypes } from "../../../services/types";
import { useRef, useState } from "react";
import { deleteAddress } from "../../../services/admin";
import { useRouter } from "next/navigation";
import PostAddressCollapse from "../../Collapse/Address/PostAddress";
import { EditSvg, HomeSvg } from "../../Misc/SvgGroup";
import { simpleModalHandler } from "../../../services/helper";

interface thisProps {
  addresses: Partial<AddressTypes[]>;
  selectedAddress: AddressTypes;
  changeAddress(address: AddressTypes): void;
}

const ChangeAddressModal = ({
  addresses,
  selectedAddress,
  changeAddress,
}: thisProps) => {
  return (
    <>
      <button
        className="absolute right-3 top-4 rounded-md p-2 transition-all duration-300 hover:bg-black/20 active:bg-black/20"
        onClick={() => simpleModalHandler("changeAddress", true)}
      >
        <EditSvg className="h-5 w-5 stroke-current" />
      </button>
      <dialog
        // data-theme={"nord"}
        id={`changeAddress`}
        className="modal overflow-hidden"
      >
        <ToastContainer
          enableMultiContainer
          containerId={"AddressList"}
          theme="dark"
        />
        <div className="no-scrollbar modal-box absolute right-1/2 max-w-2xl translate-x-1/2 px-4 py-8 text-start sm:px-8">
          <button
            className="btn btn-circle btn-ghost absolute right-4 top-4 text-lg"
            onClick={() => simpleModalHandler(`changeAddress`, false)}
          >
            ✕
          </button>
          <h3 className="mb-5 text-lg font-semibold">
            Please select another address
          </h3>
          <div className="z-10 flex flex-wrap justify-evenly gap-y-5">
            {addresses.map((address, i) => {
              if (address?._id != selectedAddress._id)
                return (
                  <div
                    key={i}
                    className="relative w-full overflow-hidden rounded-md bg-base-200 p-5 sm:px-7 sm:py-5"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="mb-1 flex items-center">
                        <p className="card-title text-lg">
                          {address?.addressLabel}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold">
                          Recipient:
                        </span>
                        <p className="text-sm">{`${address?.recipientName} - ${address?.phone}`}</p>
                      </div>
                      <div className="text-sm">{address?.address}</div>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">{`${address?.addressArea.district}, ${address?.addressArea.city}`}</p>
                        <p className="text-sm font-semibold">{`${address?.addressArea.province} ${address?.addressArea.postalCode}`}</p>
                      </div>
                      {address?.addressNote && (
                        <p className="text-sm">
                          <span className="font-semibold">Delivery Note:</span>
                          {` ${address?.addressNote}`}
                        </p>
                      )}
                      <button
                        className="btn btn-accent btn-sm mx-auto mt-3 w-[200px] text-white"
                        onClick={() => {
                          changeAddress(address!);
                          simpleModalHandler("changeAddress", false);
                        }}
                      >
                        Select Address
                      </button>
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
          {/* <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler(`changeAddress`, false)}
              >
                Close
              </button>
            </form>
          </div> */}
        </div>
      </dialog>
    </>
  );
};

export default ChangeAddressModal;
