import { Fragment, useCallback, useEffect, useState } from "react";
import { productImageUrl, simpleModalHandler } from "../../../services/helper";
import { OrderItemTypes } from "../../../services/types";
import Image from "next/image";
import cx from "classnames";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";

interface ThisProps {
  orderItems?: OrderItemTypes[];
  isShow: boolean;
  reset(): void;
}

const OrderItemModal = ({ orderItems, isShow, reset }: ThisProps) => {
  const [items, setItems] = useState<OrderItemTypes[]>();

  const thumbnailClass = useCallback((thumbnail: string) => {
    return cx({
      "w-auto max-h-[100px] rounded-md bg-cover": thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, []);

  useEffect(() => {
    if (isShow) {
      setItems(orderItems);

      setTimeout(() => {
        simpleModalHandler("itemsDetail", true);
        reset();
      }, 100);
    }
  }, [isShow]);

  return (
    <Fragment>
      <dialog data-theme="nord" id={"itemsDetail"} className="modal text-black">
        <div className="no-scrollbar modal-box absolute bg-neutral-100">
          <h3 className="modal-title mb-5">Order Items</h3>
          <div className="mt-2 flex flex-col gap-y-2">
            {items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-x-3 rounded-md bg-white p-2 shadow-lg"
              >
                <Image
                  src={productImageUrl(item.thumbnail)}
                  alt={`thumbnail-${item.item_name}`}
                  width={500}
                  height={500}
                  className={thumbnailClass(item.thumbnail)}
                />
                <div className="flex flex-col">
                  <span>{item.item_name}</span>
                  <span>
                    Price:{" "}
                    <NumFormatWrapper
                      value={item.price}
                      displayType="text"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </span>
                  <span className="text-sm text-black/60">
                    Quantity: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => simpleModalHandler("itemsDetail", false)}
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

export default OrderItemModal;
