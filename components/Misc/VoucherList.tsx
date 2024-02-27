import { Fragment, useCallback, useEffect, useState } from "react";
import {
  capitalize,
  simpleModalHandler,
  transformDate,
  transformPaymentType,
} from "../../services/helper";
import {
  CartTypes,
  PostOrderTypes,
  TransactionTypes,
  VoucherTypes,
} from "../../services/types";
import cx from "classnames";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import { getAvailableVouchers } from "../../services/admin";
import { ClockSvg } from "./SvgGroup";

interface ThisProps {
  // transaction?: Partial<TransactionTypes>;
  // isShow: string;
  // reset(): void;
  vouchers: VoucherTypes[];
  order: PostOrderTypes;
  cart: CartTypes;
  applyVoucher(voucher: VoucherTypes): void;
}

const VoucherListModal = ({
  order,
  applyVoucher,
  vouchers,
  cart,
}: ThisProps) => {
  const disableClass = useCallback((validity: boolean) => {
    return cx({
      "flex flex-col rounded-md bg-white p-5 shadow-md": true,
      "opacity-100": validity,
      "opacity-60": !validity,
    });
  }, []);

  const validityCheck = useCallback(
    (item: VoucherTypes) => {
      let valid = false;
      if (!cart) {
        return null;
      }

      if (item.conditions == "Minimal Transaction") {
        valid = order.subtotal >= item.minTransaction;
      }

      if (item.conditions == "Particular Product") {
        let validProducts: string[] = [];
        item.validProducts.map((product) => validProducts.push(product._id));

        valid =
          order.orderItems.filter((order_item) =>
            validProducts.includes(order_item._id),
          ).length > 0;
      }

      // if (item.conditions == "Particular Category") {
      //   let validCategories: string[] = [];
      //   item.validCategories.map((category) =>
      //     validCategories.push(category._id),
      //   );

      //   valid =
      //     order.orderItems.filter((order_item) =>
      //       validCategories.includes(order_item),
      //     ).length > 0;
      // }

      return valid;
    },
    [order],
  );

  const sortCallback = useCallback(
    (a: VoucherTypes, b: VoucherTypes) => {
      // Do nothing when equal
      if (validityCheck(a) === validityCheck(b)) return 0;
      // true values first
      if (validityCheck(a)) return -1;
      return 1;
    },
    [validityCheck],
  );

  useEffect(() => {
    console.log("VOUCHERS: ", vouchers);
  }, [vouchers]);

  // useEffect(() => {
  //   if (isShow == "transaction") {
  //     setData(transaction);

  //     setTimeout(() => {
  //       simpleModalHandler("voucher_list", true);
  //       reset();
  //     }, 100);
  //   }
  // }, [isShow]);

  return (
    <Fragment>
      <button
        data-theme="skies"
        className="btn btn-outline btn-sm text-neutral"
        onClick={() => simpleModalHandler("voucher_list", true)}
      >
        Vouchers
      </button>
      <dialog
        data-theme="nord"
        id={"voucher_list"}
        className="modal text-black"
      >
        <div className="no-scrollbar modal-box absolute max-w-[500px]">
          {/* <h3 className="modal-title mb-5">Voucher </h3> */}
          <div className="grid grid-cols-1 gap-2">
            {vouchers.length > 0 &&
              vouchers.sort(sortCallback).map((item, index) => (
                <div key={index} className={disableClass(validityCheck(item)!)}>
                  <span className="font-semibold">{item.voucherName}</span>
                  <div>
                    <span>{`Discount `}</span>
                    <NumFormatWrapper
                      value={item.value}
                      displayType="text"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </div>
                  {item.conditions == "Minimal Transaction" && (
                    <div className="text-sm">
                      <span>{`Minimal transaction `}</span>
                      <NumFormatWrapper
                        value={item.minTransaction}
                        displayType="text"
                        prefix="Rp. "
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </div>
                  )}
                  {item.conditions == "Particular Category" && (
                    <span className="text-sm">{`Applicable for Sweatshirt, Blazer, and Pants products`}</span>
                  )}
                  {item.conditions == "Particular Product" && (
                    <span className="my-2 text-sm">{`Applicable for Black Sweatshirt, Pink Blazer, and Grey Pants item`}</span>
                  )}
                  <div className="divider my-0"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockSvg className="h-5 w-5 stroke-black/60" />
                      <span className="text-sm">{`Expires on ${item.validUntil}`}</span>
                    </div>
                    <button
                      data-theme="skies"
                      className="btn btn-sm bg-base-100 text-white"
                      onClick={() => {
                        applyVoucher(item);
                        simpleModalHandler("voucher_list", false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler("voucher_list", false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </Fragment>
  );
};

export default VoucherListModal;
