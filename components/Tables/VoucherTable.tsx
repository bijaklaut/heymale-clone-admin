import { PaginationTypes, UserTypes, VoucherTypes } from "../../services/types";
import {
  ChangeEvent,
  Fragment,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import {
  ArrowDownSvg,
  EditSvg,
  NoteSvg,
  OptionDotSvg,
  TrashSvg,
} from "../Misc/SvgGroup";
import cx from "classnames";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";

interface ThisProps {
  paginate: PaginationTypes;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  updateMisc(voucher: VoucherTypes): void;
  deleteMisc(voucher: VoucherTypes): void;
  conditionsMisc(voucher: VoucherTypes): void;
}

const VoucherTable = ({
  paginate,
  paginateAction,
  updateMisc,
  deleteMisc,
  conditionsMisc,
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
      {vouchers.length ? (
        <Fragment>
          <div className="rounded-md bg-transparent xl:bg-neutral-100 xl:px-3 xl:py-5">
            <div className="mb-4 hidden grid-cols-voucher-xl justify-items-center gap-x-2 font-semibold text-black/60 xl:grid 3xl:grid-cols-voucher-3xl">
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
                    <div className="flex w-full flex-col items-center justify-items-stretch rounded-md bg-white px-3 py-3 text-neutral shadow-md transition-all md:gap-y-5 lg:py-5 xl:grid xl:grid-cols-voucher-xl xl:justify-items-center xl:gap-x-2 xl:px-0 xl:py-3 xl:text-sm 3xl:grid-cols-voucher-3xl">
                      <div className="grid w-full grid-cols-[50px_1fr_50px] items-center gap-x-3 md:grid-cols-[75px_1fr_75px] xl:col-span-2 xl:grid-cols-[50px_minmax(150px,1fr)] xl:gap-x-2 3xl:grid-cols-[75px_minmax(150px,1fr)]">
                        <span className="me-1 justify-self-start text-center font-semibold text-black/60 xl:me-auto xl:w-full xl:text-black">
                          {paginate.pagingCounter + index}
                        </span>
                        <div className="text-center font-semibold xl:font-normal">
                          {voucher.voucherName}
                        </div>
                        <Fragment>
                          <div className="hidden items-center justify-end gap-x-2 md:flex xl:hidden">
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="rounded-md transition-all hover:bg-black/20 active:bg-black/20"
                              >
                                <OptionDotSvg className="w-4 fill-neutral" />
                              </div>
                              <ul
                                tabIndex={0}
                                className="no-scrollbar dropdown-content z-[1] flex w-[200px] flex-col gap-y-2 overflow-y-scroll rounded-box border bg-base-100 p-2 text-sm text-white shadow [&>li:hover]:bg-white/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                              >
                                <li onClick={() => conditionsMisc(voucher)}>
                                  <span>Conditions</span>
                                </li>
                                <li onClick={() => updateMisc(voucher)}>
                                  <span>Edit Voucher</span>
                                </li>
                                <li onClick={() => deleteMisc(voucher)}>
                                  <span>Delete Voucher</span>
                                </li>
                              </ul>
                            </div>
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
                      <div className="flex w-full flex-wrap items-center justify-center gap-3 max-md:hidden sm:gap-x-6 md:px-10 md:max-lg:items-start lg:flex-col lg:gap-x-3 lg:px-0 xl:col-span-5 xl:grid xl:grid-cols-[minmax(150px,300px)_minmax(75px,125px)_150px_75px_100px] xl:gap-x-2 3xl:grid-cols-[minmax(150px,350px)_minmax(75px,150px)_175px_100px_125px]">
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
                            {voucher.validUntil}
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
                          onClick={() => conditionsMisc(voucher)}
                        >
                          <NoteSvg className="w-4 fill-current" />
                        </button>
                        <button
                          data-theme={"skies"}
                          className="btn-icon-primary"
                          onClick={() => updateMisc(voucher)}
                        >
                          <EditSvg className="w-5 stroke-current" />
                        </button>
                        <button
                          onClick={() => deleteMisc(voucher)}
                          data-theme={"skies"}
                          className="btn-icon-error"
                        >
                          <TrashSvg className="w-5 stroke-current" />
                        </button>
                      </div>
                    </div>

                    <div className={collapseClass(index)}>
                      <div className="dropdown dropdown-end mb-3 flex justify-end md:mb-5">
                        <div
                          tabIndex={0}
                          role="button"
                          className="rounded-md transition-all hover:bg-black/20 active:bg-black/20"
                        >
                          <OptionDotSvg className="w-4 fill-neutral" />
                        </div>
                        <ul
                          tabIndex={0}
                          className="no-scrollbar dropdown-content z-[1] flex w-[200px] flex-col gap-y-2 overflow-y-scroll rounded-box border bg-base-100 p-2 text-sm text-white shadow [&>li:hover]:bg-white/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                        >
                          <li onClick={() => conditionsMisc(voucher)}>
                            <span>Conditions</span>
                          </li>
                          <li onClick={() => updateMisc(voucher)}>
                            <span>Edit Voucher</span>
                          </li>
                          <li onClick={() => deleteMisc(voucher)}>
                            <span>Delete Voucher</span>
                          </li>
                        </ul>
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
                            {voucher.validUntil}
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
