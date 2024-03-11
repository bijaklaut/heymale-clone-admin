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
          <div data-theme="nord" className="overflow-auto rounded-md">
            <table className="table border-separate border-spacing-y-2 p-2">
              {/* head */}
              <thead>
                <tr className="text-base [&>th]:text-center [&>th]:font-semibold">
                  <th className="min-w-[50px]">#</th>
                  <th className="min-w-[200px]">
                    <div className="flex flex-col items-center">
                      <span>Invoice</span>
                      <span className="text-sm font-normal">
                        Transaction ID
                      </span>
                    </div>
                  </th>
                  <th className="min-w-[100px]">Merchant ID</th>
                  <th className="min-w-[180px]">Status</th>
                  <th className="min-w-[200px]">Payment Method</th>
                  <th className="min-w-[150px]">Payment Amount</th>
                  <th className="min-w-[150px]">Transaction Time</th>
                  <th className="min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="[&>tr:first-child>td:last-child>div]:dropdown-bottom [&>tr:last-child>td:last-child>div]:dropdown-top [&>tr]:rounded-md">
                {transactions.map((trx, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white shadow-sm [&>td]:text-center "
                    >
                      <td className="min-w-[50px]">
                        {paginate.pagingCounter + index}
                      </td>
                      <td className="min-w-[200px]">
                        <div className="flex flex-col">
                          <span>{trx.order_id || "-"}</span>
                          <span className="text-xs">
                            {trx.transaction_id || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="min-w-[100px]">
                        {trx.merchant_id || "-"}
                      </td>
                      <td className="min-w-[180px]">
                        <div
                          data-theme="skies"
                          className={statusClass(trx.transaction_status)}
                        >
                          {underscoreTransform(trx.transaction_status)}
                        </div>
                      </td>
                      <td className="min-w-[200px]">
                        <div className="flex flex-col">
                          {/* Permata */}
                          {trx.payment_type == "bank_transfer" &&
                            trx.permata_va_number && (
                              <>
                                <span>Permata Virtual Account</span>
                                <span>{trx.permata_va_number}</span>
                              </>
                            )}
                          {/* BCA, BNI, BRI, CIMB */}
                          {trx.payment_type == "bank_transfer" &&
                            !trx.permata_va_number && (
                              <>
                                <span>{`${trx.va_numbers[0].bank.toUpperCase()} Virtual Account`}</span>
                                <span>{trx.va_numbers[0].va_number}</span>
                              </>
                            )}
                          {/* Mandiri E-Channel */}
                          {trx.payment_type == "echannel" && (
                            <>
                              <span>Mandiri Virtual Account</span>
                              <span>{`${trx.biller_code}${trx.bill_key}`}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="min-w-[150px]">
                        <NumFormatWrapper
                          value={trx.gross_amount}
                          displayType="text"
                          prefix="Rp. "
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </td>
                      <td className="min-w-150px">
                        {transformDate(trx.transaction_time)}
                      </td>
                      <td className="min-w-[50px]">
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
                            className="no-scrollbar dropdown-content absolute -top-10 z-[1] flex w-[200px] flex-col gap-y-2 rounded-box bg-base-100 p-2 text-sm shadow [&>li:hover]:bg-neutral/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                          >
                            <li>
                              <span>More Actions</span>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
