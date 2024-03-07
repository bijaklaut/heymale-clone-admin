"use client";
import { Fragment, MouseEventHandler, useCallback } from "react";
import { PaginationTypes, TransactionTypes } from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { OptionDotSvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import cx from "classnames";
import { transformDate, underscoreTransform } from "../../services/helper";

interface TransactionPagination extends PaginationTypes {
  docs: TransactionTypes[];
}

interface ThisProps {
  paginate: TransactionPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
}

const TransactionTable = ({
  paginate,
  paginateAction,
  stateChanges,
}: ThisProps) => {
  const { docs: transactions } = paginate;
  const statusClass = useCallback((status: string) => {
    return cx({
      "w-fit badge badge-outline font-semibold py-3": status,
      "text-primary": status == "settlement",
      "text-accent": status == "pending",
      "text-error": errorStatus.includes(status),
    });
  }, []);

  return (
    <div className="min-h-screen max-w-[1920px] overflow-x-auto overflow-y-hidden">
      {transactions.length ? (
        <Fragment>
          <div className="w-fit rounded-md bg-neutral-100 px-3 py-5">
            <div className="mb-4 grid grid-cols-[50px_minmax(250px,_1fr)_150px_125px_minmax(200px,_1fr)_150px_200px_minmax(50px,100px)] items-center justify-items-center gap-x-2 font-semibold text-black/60">
              <div className="">#</div>
              <div className="flex flex-col items-center">
                <span>Invoice</span>
                <span className="text-sm font-normal">Transaction ID</span>
              </div>
              <div>Merchant ID</div>
              <div>Status</div>
              <div>Payment Method</div>
              <div>Payment Amount</div>
              <div>Transaction Time</div>
              <div></div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {transactions.map((trx, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-[50px_minmax(250px,_1fr)_150px_125px_minmax(200px,_1fr)_150px_200px_minmax(50px,100px)] items-center gap-2 rounded-md bg-white py-3 text-center text-neutral shadow-md"
                  >
                    <div>{paginate.pagingCounter + index}</div>
                    <div className="flex flex-col">
                      <span>{trx.order_id || "-"}</span>
                      <span className="text-sm">
                        {trx.transaction_id || "-"}
                      </span>
                    </div>
                    <div>{trx.merchant_id || "-"}</div>
                    <div className="flex items-center justify-center">
                      <div className={statusClass(trx.transaction_status)}>
                        {underscoreTransform(trx.transaction_status)}
                      </div>
                    </div>
                    {/* Payment Method */}
                    {/* Permata */}
                    {trx.payment_type == "bank_transfer" &&
                      trx.permata_va_number && (
                        <div className="flex flex-col">
                          <span>Permata Virtual Account</span>
                          <span>{trx.permata_va_number}</span>
                        </div>
                      )}
                    {/* BCA, BNI, BRI, CIMB */}
                    {trx.payment_type == "bank_transfer" &&
                      !trx.permata_va_number && (
                        <div className="flex flex-col">
                          <span>{`${trx.va_numbers[0].bank.toUpperCase()} Virtual Account`}</span>
                          <span>{trx.va_numbers[0].va_number}</span>
                        </div>
                      )}
                    {/* Mandiri E-Channel */}
                    {trx.payment_type == "echannel" && (
                      <div className="flex flex-col">
                        <span>Mandiri Virtual Account</span>
                        <span>{`${trx.biller_code}${trx.bill_key}`}</span>
                      </div>
                    )}

                    <div>
                      <NumFormatWrapper
                        value={trx.gross_amount}
                        displayType="text"
                        prefix="Rp. "
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </div>
                    <div>{transformDate(trx.transaction_time)}</div>
                    <div>
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
                          className="no-scrollbar dropdown-content z-[1] flex w-[200px] flex-col gap-y-2 rounded-box bg-base-100 p-2 text-sm text-white shadow [&>li:hover]:bg-white/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                        >
                          <li>
                            <span>More Actions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <div className="flex min-h-[500px] items-center">
          <NoDisplay text="There's no shipments to display" />
        </div>
      )}
    </div>
  );
};

const errorStatus = [
  "deny",
  "cancel",
  "expire",
  "failure",
  "courier_not_found",
  "cancelled",
  "rejected",
  "disposed",
  "returned",
];

export default TransactionTable;
