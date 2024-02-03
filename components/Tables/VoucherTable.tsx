import { PaginationTypes, UserTypes, VoucherTypes } from "../../services/types";
import DeleteUserModal from "../Modals/User/DeleteUser";
import UpdateUserModal from "../Modals/User/UpdateUser";
import ChangePasswordModal from "../Modals/User/ChangePassword";
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import AddressListModal from "../Modals/User/AddressList";
import {
  ArrowDownSvg,
  EditSvg,
  MailSvg,
  PhoneSvg,
  TrashSvg,
  UserSvg,
} from "../Misc/SvgGroup";
import { ProductExpand } from "../Misc/ProductExpand";
import cx from "classnames";
import VoucherCondition from "../Modals/Voucher/VoucherCondition";

interface ThisProps {
  stateChanges(): void;
  paginate: PaginationTypes;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
}

const VoucherTable = ({
  paginate,
  stateChanges,
  paginateAction,
}: ThisProps) => {
  const { docs: vouchers } = paginate;
  const [active, setActive] = useState(-1);

  const collapseClass = useCallback(
    (index: number) => {
      return cx({
        "flex w-full origin-top flex-col justify-between gap-x-3 rounded-md bg-white p-3 text-neutral shadow-md sm:py-4 md:px-5 lg:px-3":
          true,
        "static scale-100 opacity-100": true,
        // "absolute scale-0 opacity-0": active != index,
      });
    },
    [active],
  );

  const statusClass = useCallback((status: string) => {
    return cx({
      "badge badge-outline px-3 font-semibold lg:justify-self-center": true,
      "badge-primary": status == "Active",
      "badge-error": status == "Inactive",
    });
  }, []);

  const expandHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>, index: number) => {
      const parent = event.target.parentElement;

      if (active == index) {
        setActive(-1);
      } else {
        setActive(index);
        setTimeout(() => {
          window.scrollTo({
            top: parent!.offsetTop - 85,
            behavior: "smooth",
          });
        }, 50);
      }
    },
    [active],
  );

  return (
    <div className="max-w-[1920px]">
      {vouchers.length ? (
        <Fragment>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:items-stretch lg:justify-items-center 2xl:mx-auto 2xl:max-w-fit 2xl:gap-5 3xl:grid-cols-3">
            {(vouchers as VoucherTypes[]).map((voucher, index) => {
              return (
                <Fragment key={index}>
                  <div className="grid h-fit w-full grid-cols-5 items-center justify-items-stretch rounded-md bg-white px-3 py-3 text-neutral shadow-md sm:hidden">
                    {/* Number */}
                    <span className="me-1 justify-self-start font-semibold text-base-100/60 2xl:justify-self-center">
                      {paginate.pagingCounter + index}
                    </span>

                    {/* Main content */}
                    <div className="col-span-3 flex w-full items-center justify-center gap-x-3 justify-self-center sm:gap-x-5 md:col-span-3 md:grid md:grid-cols-4 lg:col-span-8 lg:grid-cols-4 xl:col-span-10">
                      {/* Voucher Name */}
                      <div className="justify-self-center text-center font-semibold md:justify-self-start md:text-start">
                        {voucher.voucherName}
                      </div>
                      {/* Status */}
                      <div className="justify-self-center max-[460px]:hidden">
                        <div
                          data-theme="skies"
                          className={statusClass(voucher.status)}
                        >
                          {voucher.status}
                        </div>
                      </div>
                    </div>

                    {/* Expand */}
                    <div className="justify-self-end 2xl:justify-self-center">
                      <div className="flex items-center justify-center gap-x-2 p-3">
                        <div className="form-control xl:hidden">
                          <label className="label cursor-pointer p-0">
                            <input
                              type="checkbox"
                              checked={active == index}
                              className="peer checkbox hidden"
                              onChange={(e) => expandHandler(e, index)}
                            />
                            <ArrowDownSvg className="label-text fill-gray-500 transition-all peer-checked:rotate-180" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={collapseClass(index)}>
                    <div className="mb-8 hidden w-full gap-x-3 sm:grid sm:grid-cols-[50px_1fr_50px] lg:gap-x-4">
                      <div className="font-semibold text-base-100/60">
                        {paginate.pagingCounter + index}
                      </div>
                      <div className="flex items-center gap-x-3 justify-self-center">
                        <div className="font-semibold">
                          {voucher.voucherName}
                        </div>
                        <div
                          data-theme="skies"
                          className={statusClass(voucher.status)}
                        >
                          {voucher.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2 justify-self-end">
                        <button
                          data-theme={"skies"}
                          className="btn-icon-primary"
                        >
                          <EditSvg className="w-5 stroke-current" />
                        </button>
                        <button data-theme={"skies"} className="btn-icon-error">
                          <TrashSvg className="w-5 stroke-current" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 sm:grid sm:grid-cols-2 sm:gap-x-6 md:px-10 lg:gap-x-3 lg:px-0">
                      <div className="flex w-full min-w-fit flex-col items-center gap-y-2 min-[460px]:max-sm:max-w-[200px]">
                        <span className="font-semibold">Voucher Code</span>
                        <div className="w-full min-w-[150px] rounded-md border-2 border-black py-1 text-center sm:min-w-[200px]">
                          {voucher.voucherCode}
                        </div>
                      </div>
                      <div className="flex w-full min-w-fit flex-col items-center gap-y-2 min-[460px]:max-sm:max-w-[200px]">
                        <span className="font-semibold">Voucher Value</span>
                        <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                          {voucher.value}
                        </div>
                      </div>
                      <div className="flex w-full min-w-fit flex-col items-center gap-y-2 min-[460px]:max-sm:max-w-[200px]">
                        <span className="font-semibold">Validity Period</span>
                        <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                          {voucher.validUntil.split("T")[0]}
                        </div>
                      </div>
                      <div className="flex w-full min-w-fit flex-col items-center gap-y-2 min-[460px]:hidden">
                        <span className="font-semibold">Status</span>
                        <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                          {voucher.status}
                        </div>
                      </div>
                      <div className="flex w-full min-w-fit flex-col items-center gap-y-2 min-[460px]:max-sm:max-w-[200px]">
                        <span className="font-semibold">Quota</span>
                        <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                          {voucher.voucherQuota}
                        </div>
                      </div>
                    </div>
                    <VoucherCondition index={index} voucher={voucher} />
                  </div>
                </Fragment>
              );
            })}
          </div>

          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text={"There's no products to display"} />
      )}
    </div>
  );
};

export default VoucherTable;
