import { Fragment, useCallback, useEffect, useState } from "react";
import {
  capitalize,
  simpleModalHandler,
  transformDate,
  transformPaymentType,
} from "../../../services/helper";
import { TransactionTypes } from "../../../services/types";
import cx from "classnames";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";

interface ThisProps {
  transaction?: Partial<TransactionTypes>;
  isShow: string;
  reset(): void;
}

const TransactionDetailModal = ({ transaction, isShow, reset }: ThisProps) => {
  const [data, setData] = useState<Partial<TransactionTypes>>();

  useEffect(() => {
    if (isShow == "transaction") {
      setData(transaction);

      setTimeout(() => {
        simpleModalHandler("transactionDetail", true);
        reset();
      }, 100);
    }
  }, [isShow]);

  return (
    <Fragment>
      <dialog
        data-theme="nord"
        id={"transactionDetail"}
        className="modal text-black"
      >
        {transaction && (
          <div className="no-scrollbar modal-box absolute max-w-[600px] bg-neutral-100">
            <h3 className="modal-title mb-5">Transaction Detail</h3>
            <div className="mt-2 flex flex-col gap-y-2">
              <div className="grid grid-cols-2">
                <div className="font-semibold">Transaction ID</div>
                <div>{data?.transaction_id}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Order ID</div>
                <div>{data?.order_id}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Merchant ID</div>
                <div>{data?.merchant_id}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Transaction Status</div>
                <div>{capitalize(data?.transaction_status!)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Gross Amount</div>
                <div>
                  <NumFormatWrapper
                    value={data?.gross_amount}
                    displayType="text"
                    prefix="Rp. "
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Payment Type</div>
                <div>{transformPaymentType(data?.payment_type!)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="font-semibold">Fraud Status</div>
                <div>{capitalize(data?.fraud_status!)}</div>
              </div>
              {data?.payment_type == "echannel" && (
                <>
                  <div className="grid grid-cols-2">
                    <div className="font-semibold">Biller Code</div>
                    <div>{data?.biller_code}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="font-semibold">Bill Key</div>
                    <div>{data?.bill_key}</div>
                  </div>
                </>
              )}
              {data?.payment_type == "bank_transfer" &&
                data.va_numbers!.map((va, index) => (
                  <div key={index} className="grid grid-cols-2">
                    <div className="font-semibold">Virtual Account</div>
                    <div>{`${va.bank.toUpperCase()} - ${va.va_number}`}</div>
                  </div>
                ))}
              <div className="grid grid-cols-2">
                <div className="font-semibold">Transaction Time</div>
                <div>{transformDate(data?.transaction_time!)}</div>
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => simpleModalHandler("transactionDetail", false)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </dialog>
    </Fragment>
  );
};

export default TransactionDetailModal;
