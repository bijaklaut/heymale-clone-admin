"use client";
import Image from "next/image";
import { PaginationTypes, PaymentTypes } from "../../services/types";
import DeletePaymentModal from "../Modals/Payment/DeletePayment";
import UpdatePaymentModal from "../Modals/Payment/UpdatePayment";
import { Fragment } from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";

interface PaymentPagination extends PaginationTypes {
  docs: PaymentTypes[];
}

interface ThisProps {
  paginate: PaymentPagination;
  pageHandler(page: number | null): void;
  stateChanges(): void;
}

const PaymentTable = ({ paginate, pageHandler, stateChanges }: ThisProps) => {
  const { docs: payments } = paginate;

  return (
    <div className="max-w-3xl">
      {payments.length >= 1 ? (
        <Fragment>
          <table
            data-theme="nord"
            className="table w-full min-w-[500px] rounded-md"
          >
            <thead>
              <tr>
                <th className="w-[70px] text-center text-base font-semibold">
                  #
                </th>
                <th className="min-w-[250px] text-center text-base font-semibold">
                  Owner Name
                </th>
                <th className="min-w-[250px] text-center text-base font-semibold">
                  Bank Account
                </th>
                <th className="min-w-[150px] text-center text-base font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: PaymentTypes, i: any) => {
                return (
                  <tr key={i} className="hover h-full">
                    <th className="text-center">{i + 1}</th>
                    <td className="text-center">{payment.ownerName}</td>
                    <td>
                      <div className="flex w-full flex-col items-center gap-1">
                        <Image
                          src={`/images/logo/bank-${payment.bankName.toLowerCase()}.png`}
                          width={50}
                          height={50}
                          alt={`logo-${payment.bankName}`}
                          className="bg-cover"
                        />
                        <span>No: {payment.accountNo}</span>
                      </div>
                    </td>
                    <td className="flex min-h-[70px] w-full items-center justify-center">
                      <UpdatePaymentModal
                        payment={payment}
                        index={i}
                        stateChanges={stateChanges}
                      />
                      <DeletePaymentModal
                        payment={payment}
                        index={i}
                        stateChanges={stateChanges}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination paginate={paginate} pageHandler={pageHandler} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no payment to display" />
      )}
    </div>
  );
};

export default PaymentTable;
