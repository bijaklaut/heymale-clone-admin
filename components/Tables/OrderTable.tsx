"use client";
import { Fragment, MouseEventHandler } from "react";
import {
  OrderItemTypes,
  OrderTypes,
  PaginationTypes,
  TransactionTypes,
} from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { OptionDotSvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import { capitalize } from "../../services/helper";

interface OrderPagination extends PaginationTypes {
  docs: OrderTypes[];
}

interface ThisProps {
  paginate: OrderPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
  itemsDetailMisc(items: OrderItemTypes[]): void;
  trxDetailMisc(transaction: Partial<TransactionTypes>): void;
}

const OrderTable = ({
  paginate,
  paginateAction,
  stateChanges,
  itemsDetailMisc,
  trxDetailMisc,
}: ThisProps) => {
  const { docs: orders } = paginate;

  return (
    <div className="min-h-screen max-w-[1920px]">
      {orders.length ? (
        <Fragment>
          <div className="rounded-md bg-transparent xl:bg-neutral-100 xl:px-3 xl:py-5">
            <div className="mb-4 hidden grid-cols-[50px_1fr_1fr_200px_200px_150px_50px] justify-items-center gap-x-2 font-semibold text-black/60 xl:grid">
              <div className="">#</div>
              <div className="">Invoice</div>
              <div className="">User</div>
              <div className="">Status</div>
              <div>Order Item</div>
              <div>Total Price</div>
              <div></div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {orders.map((order, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-[50px_1fr_1fr_200px_200px_150px_50px] items-center gap-2 rounded-md bg-white py-3 text-center text-neutral shadow-md"
                  >
                    <div>{paginate.pagingCounter + index}</div>
                    <div>{order.invoice}</div>
                    <div className="flex flex-col">
                      <span>{order.user.name}</span>
                      <span className="text-sm">
                        Contact: {order.user.phoneNumber}
                      </span>
                    </div>
                    <div>{`${capitalize(order.status)}`}</div>
                    <div>
                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => itemsDetailMisc(order.order_item)}
                      >
                        See Details
                      </button>
                    </div>
                    <div>
                      <NumFormatWrapper
                        value={order.total_price}
                        displayType="text"
                        prefix="Rp. "
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </div>
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
                            <span>Edit Order</span>
                          </li>
                          <li onClick={() => trxDetailMisc(order.transaction)}>
                            <span>Transaction Detail</span>
                          </li>
                          <li>
                            <span>Shipment Detail</span>
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
          <NoDisplay text="There's no orders to display" />
        </div>
      )}
    </div>
  );
};

export default OrderTable;
