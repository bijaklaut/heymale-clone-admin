import { Fragment, useCallback, useEffect, useState } from "react";
import { productImageUrl, simpleModalHandler } from "../../../services/helper";
import { ProductTypes, VoucherTypes } from "../../../services/types";
import Image from "next/image";
import cx from "classnames";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";

interface ThisProps {
  condItem?: VoucherTypes;
  isShow: boolean;
  reset(): void;
}
const initData = (voucher?: VoucherTypes) => {
  if (voucher) {
    return {
      id: voucher._id,
      voucherName: voucher.voucherName,
      voucherCode: voucher.voucherCode,
      conditions: voucher.conditions,
      minTransaction: voucher.minTransaction,
      validProducts: voucher.validProducts,
      validCategories: voucher.validCategories,
      value: voucher.value,
      validUntil: voucher.validUntil,
      status: voucher.status,
      voucherQuota: voucher.voucherQuota,
    };
  }

  return {
    voucherName: "",
    voucherCode: "",
    conditions: "",
    minTransaction: 0,
    validProducts: [],
    validCategories: [],
    value: 0,
    validUntil: "",
    status: "",
    voucherQuota: 0,
  };
};

const VoucherConditionModal = ({ condItem, isShow, reset }: ThisProps) => {
  const [voucher, setVoucher] = useState(initData());

  const thumbnailClass = useCallback((thumbnail: string) => {
    return cx({
      "w-auto max-h-[100px] rounded-md bg-cover": thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  useEffect(() => {
    if (isShow) {
      setVoucher(initData(condItem));

      setTimeout(() => {
        simpleModalHandler("voucherCond", true);
        reset();
      }, 100);
    }
  }, [isShow]);

  return (
    <Fragment>
      <dialog data-theme="nord" id={"voucherCond"} className="modal text-black">
        <div className="no-scrollbar modal-box absolute bg-neutral-100">
          <h3 className="modal-title mb-5">Voucher Conditions</h3>
          <div>
            <div className="mx-auto flex w-full min-w-fit max-w-[200px] flex-col items-center gap-y-2">
              <span className="font-semibold">Conditions Type</span>
              <div className="w-full min-w-[150px] rounded-md border-2 border-black py-1 text-center sm:min-w-[200px]">
                {voucher.conditions}
              </div>
            </div>
            {voucher.conditions == "Minimal Transaction" && (
              <div className="mx-auto mt-5 flex w-full min-w-fit max-w-[200px] flex-col items-center gap-y-2">
                <span className="font-semibold">Minimal Transaction</span>
                <div className="w-full min-w-[150px] rounded-md border-2 border-black py-1 text-center sm:min-w-[200px]">
                  <NumFormatWrapper
                    value={voucher.minTransaction}
                    displayType="text"
                    prefix="Rp. "
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </div>
              </div>
            )}
            {voucher.conditions == "Particular Product" && (
              <div className="mt-5">
                <span className="font-semibold">
                  Products {`(${voucher.validProducts.length})`}
                </span>
                <div className="mt-2 flex flex-col gap-y-2">
                  {voucher.validProducts.map((product, i) => {
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-x-3 rounded-md bg-white p-2 shadow-lg"
                      >
                        <Image
                          src={productImageUrl(product.thumbnail)}
                          alt={`thumbnail-${product.name}`}
                          width={500}
                          height={500}
                          className={thumbnailClass(product.thumbnail)}
                        />
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          <span className="text-sm text-black/60">
                            {product.category.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {voucher.conditions == "Particular Category" && (
              <div className="mt-5">
                <span className="font-semibold">
                  Categories {`(${voucher.validCategories.length})`}
                </span>
                <div className="mt-2 flex flex-col gap-y-2">
                  {voucher.validCategories.map((category, i) => {
                    return (
                      <div
                        key={i}
                        className="flex justify-center gap-x-3 rounded-md bg-white p-2 shadow-lg"
                      >
                        <span>{category.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler("voucherCond", false)}
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

export default VoucherConditionModal;
