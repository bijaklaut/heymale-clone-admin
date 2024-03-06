"use client";
import {
  Fragment,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import { createShippingOrder } from "../../services/admin";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
  tabHandler(tab: string): void;
  activeTab: string;
}

const OrderTable = ({
  paginate,
  paginateAction,
  stateChanges,
  itemsDetailMisc,
  trxDetailMisc,
  shipmentDetailMisc,
  tabHandler,
  activeTab: tab,
}: ThisProps) => {
  const { docs: orders } = paginate;

  const statusClass = useCallback((status: string) => {
    return cx({
      "w-fit py-3 badge badge-outline font-semibold": true,
      "text-neutral/50": status == "pending",
      "text-primary": status == "delivered",
      "text-success border-2": status == "settlement",
      "text-error": errorStatus.includes(status),
      "text-accent": ongoingStatus.includes(status),
    });
  }, []);

  const createShippingOrderAPI = useCallback(async (invoice: string) => {
    try {
      const result = await createShippingOrder({ invoice });
      toast.success(result.message, { containerId: "Main" });
      return stateChanges();
    } catch (error: any) {
      toast.error(error.message, { containerId: "Main" });
    }
  }, []);

  return (
    <div className="min-h-screen max-w-[1920px]">
      {orders.length ? (
        <Fragment>
          <div className="rounded-md bg-neutral-100 px-3 py-5">
            <div className="mb-4 grid grid-cols-[50px_1fr_1fr_200px_200px_150px_50px] justify-items-center gap-x-2 font-semibold text-black/60">
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
                    </div>
                    <div>
                      <button
                        className="btn btn-primary btn-xs text-sm"
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
                          className="no-scrollbar dropdown-content z-[1] flex max-h-[150px] w-[200px] flex-col gap-y-2 overflow-y-auto rounded-box bg-base-100 p-2 text-sm text-white shadow [&>li:hover]:bg-white/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                        >
                          {order.status == "settlement" && (
                            <li
                              onClick={() =>
                                createShippingOrderAPI(order.invoice)
                              }
                            >
                              <span>Create Shipping Order</span>
                            </li>
                          )}
                          {/* <li>
                            <span>Edit Order</span>
                          </li> */}
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
  "delivered",
];
