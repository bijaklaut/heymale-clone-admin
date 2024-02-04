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
  NoteSvg,
  PhoneSvg,
  TrashSvg,
  UserSvg,
} from "../Misc/SvgGroup";
import { ProductExpand } from "../Misc/ProductExpand";
import cx from "classnames";
import VoucherCondition from "../Modals/Voucher/VoucherCondition";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";

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
        "flex w-full origin-top flex-col justify-between gap-x-3 rounded-md bg-white px-3 pt-3 pb-8 text-neutral shadow-md sm:py-4 md:px-5 lg:px-3 xl:hidden":
          true,
        "relative scale-100 opacity-100 md:absolute md:scale-0 md:opacity-0":
          active == index,
        "absolute scale-0 opacity-0": active != index,
      });
    },
    [active],
  );

  const statusClass = useCallback((status: string) => {
    return cx({
      "xl:badge xl:badge-outline xl:px-3 xl:font-semibold w-full min-w-[150px] rounded-md max-xl:border-2 max-xl:border-black px-2 py-1 text-center sm:min-w-[200px] xl:min-w-fit":
        true,
      "xl:badge-primary xl:text-primary": status == "Active",
      "xl:badge-neutral xl:text-neutral xl:opacity-60": status == "Inactive",
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
      {/* <div data-theme="nord" className="rounded-md p-3">
        <div className="grid-cols-voucher-xl grid justify-items-center gap-x-2">
          <div className="">#</div>
          <div className="">Voucher</div>
          <div className="">Code</div>
          <div className="">Value</div>
          <div>Valid Period</div>
          <div>Status</div>
          <div>Quota</div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          {(vouchers as VoucherTypes[]).map((voucher, index) => {
            return (
              <div
                key={index}
                className="grid-cols-voucher-xl grid items-center justify-items-center gap-x-2 py-2 text-center"
              >
                <div>{paginate.pagingCounter + index}</div>
                <div className="text-center">{voucher.voucherName}</div>
                <div className="w-full max-w-[250px] break-words">
                  {voucher.voucherCode}
                </div>
                <div>
                  <NumFormatWrapper
                    value={500000}
                    displayType="text"
                    prefix="Rp. "
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </div>
                <div>{voucher.validUntil.split("T")[0]}</div>
                <div>
                  <div
                    data-theme="skies"
                    className={statusClass(voucher.status)}
                  >
                    {voucher.status}
                  </div>
                </div>
                <div>{voucher.voucherQuota}</div>
                <div>
                  <div className="flex items-center gap-x-2 justify-self-end">
                    <button data-theme={"skies"} className="btn-icon-success">
                      <NoteSvg className="w-4 fill-current" />
                    </button>
                    <button data-theme={"skies"} className="btn-icon-primary">
                      <EditSvg className="w-5 stroke-current" />
                    </button>
                    <button data-theme={"skies"} className="btn-icon-error">
                      <TrashSvg className="w-5 stroke-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
      {vouchers.length ? (
        <Fragment>
          <div className="rounded-md bg-transparent xl:bg-slate-50/90 xl:px-3 xl:py-5">
            <div className="3xl:grid-cols-voucher-3xl mb-4 hidden grid-cols-voucher-xl justify-items-center gap-x-2 font-semibold text-black/60 xl:grid">
              <div className="">#</div>
              <div className="">Voucher</div>
              <div className="">Code</div>
              <div className="">Value</div>
              <div>Valid Period</div>
              <div>Status</div>
              <div>Quota</div>
              <div></div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:items-stretch lg:justify-items-center xl:grid-cols-1 xl:text-center">
              {(vouchers as VoucherTypes[]).map((voucher, index) => {
                return (
                  <Fragment key={index}>
                    <div className="3xl:grid-cols-voucher-3xl flex w-full flex-col items-center justify-items-stretch rounded-md bg-white px-3 py-3 text-neutral shadow-md md:gap-y-5 lg:py-5 xl:grid xl:grid-cols-voucher-xl xl:justify-items-center xl:gap-x-2 xl:px-0 xl:py-3 xl:text-sm">
                      <div className="grid w-full grid-cols-[50px_1fr_50px] items-center gap-x-3 md:grid-cols-[75px_1fr_75px] xl:col-span-2 xl:grid-cols-[50px_minmax(150px,1fr)] xl:gap-x-2 3xl:grid-cols-[75px_minmax(150px,1fr)]">
                        <span className="me-1 justify-self-start text-center font-semibold text-black/60 xl:me-auto xl:w-full xl:text-black">
                          {paginate.pagingCounter + index}
                        </span>
                        <div className="text-center font-semibold xl:font-normal">
                          {voucher.voucherName}
                        </div>
                        <Fragment>
                          <div className="hidden items-center gap-x-2 md:flex xl:hidden">
                            <button
                              data-theme={"skies"}
                              className="btn-icon-success"
                            >
                              <NoteSvg className="w-4 fill-current" />
                            </button>
                            <button
                              data-theme={"skies"}
                              className="btn-icon-primary"
                            >
                              <EditSvg className="w-5 stroke-current" />
                            </button>
                            <button
                              data-theme={"skies"}
                              className="btn-icon-error"
                            >
                              <TrashSvg className="w-5 stroke-current" />
                            </button>
                          </div>
                          <div className="justify-self-end md:hidden">
                            <div className="form-control">
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
                        </Fragment>
                      </div>
                      <div className="flex w-full flex-wrap items-center justify-center gap-3 max-md:hidden sm:gap-x-6 md:px-10 lg:flex-col lg:gap-x-3 lg:px-0 xl:col-span-5 xl:grid xl:grid-cols-[minmax(150px,300px)_minmax(75px,125px)_150px_75px_100px] xl:gap-x-2 3xl:grid-cols-[minmax(150px,350px)_minmax(75px,150px)_175px_100px_125px]">
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px] lg:max-w-[350px]">
                          <span className="xl:hidden">Voucher Code</span>
                          <div className="w-full min-w-[150px] break-words rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px] xl:border-0">
                            {voucher.voucherCode}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px] lg:max-w-[350px]">
                          <span className="xl:hidden">Voucher Value</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px] xl:border-0">
                            <NumFormatWrapper
                              value={voucher.value}
                              displayType="text"
                              prefix="Rp. "
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px] lg:max-w-[350px]">
                          <span className="xl:hidden">Validity Period</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px] xl:border-0">
                            {voucher.validUntil.split("T")[0]}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px] lg:max-w-[350px]">
                          <span className="xl:hidden">Status</span>
                          <div className={statusClass(voucher.status)}>
                            {voucher.status}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px] lg:max-w-[350px]">
                          <span className="xl:hidden">Quota</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px] xl:border-0">
                            {voucher.voucherQuota}
                          </div>
                        </div>
                      </div>
                      <div className="hidden items-center gap-x-2 xl:flex">
                        <button
                          data-theme={"skies"}
                          className="btn-icon-success"
                        >
                          <NoteSvg className="w-4 fill-current" />
                        </button>
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
                      {/* Separate */}
                      {/* <div className="w-full max-w-[250px] break-words max-xl:hidden">
                        {voucher.voucherCode}
                      </div>
                      <div className="max-xl:hidden">
                        <NumFormatWrapper
                          value={500000}
                          displayType="text"
                          prefix="Rp. "
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </div>
                      <div className="max-xl:hidden">
                        {voucher.validUntil.split("T")[0]}
                      </div>
                      <div className="max-xl:hidden">
                        <div
                          data-theme="skies"
                          className={statusClass(voucher.status)}
                        >
                          {voucher.status}
                        </div>
                      </div>
                      <div className="max-xl:hidden">
                        {voucher.voucherQuota}
                      </div> */}
                    </div>

                    <div className={collapseClass(index)}>
                      <div className="mb-3 sm:items-center sm:gap-x-2 md:mb-5 md:grid md:grid-cols-[75px_1fr_75px]">
                        <div className="font-semibold text-base-100/60 max-md:hidden">
                          {paginate.pagingCounter + index}
                        </div>
                        <div className="text-center font-semibold max-md:hidden">
                          {voucher.voucherName}
                        </div>
                        <div className="flex items-center justify-end gap-x-2">
                          <button
                            data-theme={"skies"}
                            className="btn-icon-success"
                          >
                            <NoteSvg className="w-4 fill-current" />
                          </button>
                          <button
                            data-theme={"skies"}
                            className="btn-icon-primary"
                          >
                            <EditSvg className="w-5 stroke-current" />
                          </button>
                          <button
                            data-theme={"skies"}
                            className="btn-icon-error"
                          >
                            <TrashSvg className="w-5 stroke-current" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-3 sm:gap-x-6 md:px-10 lg:gap-x-3 lg:px-0">
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px]">
                          <span className="font-semibold">Voucher Code</span>
                          <div className="w-full min-w-[150px] break-words rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                            {voucher.voucherCode}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px]">
                          <span className="font-semibold">Voucher Value</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                            {voucher.value}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px]">
                          <span className="font-semibold">Validity Period</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                            {voucher.validUntil.split("T")[0]}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px]">
                          <span className="font-semibold">Status</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                            {voucher.status}
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-y-2 min-[460px]:max-w-[200px]">
                          <span className="font-semibold">Quota</span>
                          <div className="w-full min-w-[150px] rounded-md border-2 border-black px-2 py-1 text-center sm:min-w-[200px]">
                            {voucher.voucherQuota}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
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
