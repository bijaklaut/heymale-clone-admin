"use client";
import { Fragment, MouseEventHandler, useCallback } from "react";
import {
  OrderItemTypes,
  OrderTypes,
  PaginationTypes,
  ShipmentTypes,
  TransactionTypes,
} from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { InfoSvg, OptionDotSvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import cx from "classnames";
import { capitalize, underscoreTransform } from "../../services/helper";

interface OrderPagination extends PaginationTypes {
  docs: OrderTypes[];
}

interface ThisProps {
  paginate: OrderPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
  itemsDetailMisc(items: OrderItemTypes[]): void;
  trxDetailMisc(transaction: Partial<TransactionTypes>): void;
  shipmentDetailMisc(shipment: Partial<ShipmentTypes>): void;
}

const OrderTable = ({
  paginate,
  paginateAction,
  stateChanges,
  itemsDetailMisc,
  trxDetailMisc,
  shipmentDetailMisc,
}: ThisProps) => {
  const { docs: orders } = paginate;
  const statusClass = useCallback((status: string) => {
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

    const ongoingStatus = [
      "confirmed",
      "allocated",
      "picking_up",
      "picked",
      "dropping_off",
      "return_in_transit",
    ];

    return cx({
      "w-fit py-3 badge badge-outline font-semibold": true,
      "xl:text-neutral/50": status == "pending",
      "xl:text-primary": status == "delivered",
      "xl:text-success border-2": status == "settlement",
      "xl:text-error": errorStatus.includes(status),
      "xl:text-accent": ongoingStatus.includes(status),
    });
  }, []);

  return (
    <div className="text- min-h-screen max-w-[1920px]">
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
                    <div className="flex items-center justify-center">
                      <div className={statusClass(order.status)}>
                        {underscoreTransform(order.status)}
                      </div>
                      {/* {order.status != "pending" && (
                        <div className="dropdown dropdown-end">
                          <button
                            tabIndex={0}
                            className="btn-icon-primary translate-y-1"
                          >
                            <InfoSvg className="w-4 stroke-current" />
                          </button>
                          <div
                            tabIndex={0}
                            className="card dropdown-content z-[1] h-[150px] w-64 rounded-md border bg-white p-0 shadow-md"
                          >
                            <div tabIndex={0} className="card-body">
                              <div className="grid grid-cols-1">
                                <span className="text-sm text-black/60">
                                  Payment Status
                                </span>
                                <span>
                                  {order.transaction.transaction_status
                                    ? underscoreTransform(
                                        order.transaction.transaction_status,
                                      )
                                    : "-"}
                                </span>
                              </div>
                              <div className="grid grid-cols-1">
                                <span className="text-sm text-black/60">
                                  Shipping Status
                                </span>
                                <span>
                                  {order.shipping_detail.status
                                    ? underscoreTransform(
                                        order.shipping_detail.status,
                                      )
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
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
                          <li
                            onClick={() =>
                              shipmentDetailMisc(order.shipping_detail)
                            }
                          >
                            <span>Shipping Detail</span>
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
