import { Fragment, useCallback } from "react";
import { simpleModalHandler } from "../../../services/helper";
import { ProductTypes, VoucherTypes } from "../../../services/types";
import Image from "next/image";
import cx from "classnames";

interface ThisProps {
  index: number;
  voucher: VoucherTypes;
}

const VoucherCondition = ({ index, voucher }: ThisProps) => {
  const generateUrl = useCallback((product: ProductTypes) => {
    const IMG_API = process.env.NEXT_PUBLIC_IMG;
    const { thumbnail } = product;
    return thumbnail ? `${IMG_API}/product/${thumbnail}` : "icon/image.svg";
  }, []);

  const thumbnailClass = useCallback((thumbnail: string) => {
    return cx({
      "w-auto max-h-[100px] rounded-md bg-cover": thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  return (
    <Fragment>
      <button
        className="btn btn-accent btn-sm mx-auto mt-5 w-[200px] text-white"
        onClick={() => simpleModalHandler(`cond${index}`, true)}
      >
        Voucher Conditions
      </button>
      <dialog data-theme="nord" id={`cond${index}`} className="modal">
        <div className="modal-box absolute">
          <h3 className="modal-title mb-5">Voucher Conditions</h3>
          <div>
            <div className="mx-auto flex w-full min-w-fit max-w-[200px] flex-col items-center gap-y-2">
              <span className="font-semibold">Conditions Type</span>
              <div className="w-full min-w-[150px] rounded-md border-2 border-black py-1 text-center sm:min-w-[200px]">
                {voucher.conditions}
              </div>
            </div>
            <div className="mt-5">
              <span className="font-semibold">Products</span>
              <div className="mt-2 flex flex-col gap-y-2">
                {voucher.validProducts.map((product, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-x-3 rounded-md bg-white p-2 shadow-lg"
                    >
                      <Image
                        src={generateUrl(product)}
                        alt={`thumbnail-${product.name}`}
                        width={500}
                        height={500}
                        className={thumbnailClass(product.thumbnail)}
                      />
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-sm text-black/50">
                          {product.category.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler(`cond${index}`, false)}
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

export default VoucherCondition;
