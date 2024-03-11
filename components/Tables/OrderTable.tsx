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
      "text-success": status == "settlement",
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
    <div className="max-w-[1920px]">
      {orders.length ? (
        <Fragment>
          <div data-theme="nord" className="overflow-auto rounded-md">
            <table className="table border-separate border-spacing-y-2 p-2">
              {/* head */}
              <thead>
                <tr className="text-base [&>th]:text-center [&>th]:font-semibold">
                  <th className="min-w-[50px]">#</th>
                  <th className="min-w-[200px]">Invoice</th>
                  <th className="min-w-[200px]">User</th>
                  <th className="min-w-[180px]">Status</th>
                  <th className="min-w-[150px]">Order Item</th>
                  <th className="min-w-[150px]">Total Price</th>
                  <th className="min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="[&>tr:first-child>td:last-child>div]:dropdown-bottom [&>tr:last-child>td:last-child>div]:dropdown-top [&>tr:nth-last-child(2)>td:last-child>div]:dropdown-top [&>tr]:rounded-md">
                {orders.map((order, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white shadow-sm [&>td]:text-center "
                    >
                      <td className="min-w-[50px]">
                        {paginate.pagingCounter + index}
                      </td>
                      <td className="min-w-[200px]">{order.invoice || "-"}</td>
                      <td className="min-w-[200px]">
                        <div className="flex flex-col">
                          <span>{order.user.name}</span>
                          <span>Contact: {order.user.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="min-w-[180px]">
                        <div
                          data-theme="skies"
                          className={statusClass(order.status)}
                        >
                          {underscoreTransform(order.status)}
                        </div>
                      </td>
                      <td className="min-w-[150px]">
                        <button
                          data-theme="skies"
                          className="btn btn-primary btn-xs text-sm"
                          onClick={() => itemsDetailMisc(order.order_item)}
                        >
                          See Details
                        </button>
                      </td>
                      <td className="min-w-[150px]">
                        <NumFormatWrapper
                          value={order.total_price}
                          displayType="text"
                          prefix="Rp. "
                          thousandSeparator="."
                          decimalSeparator=","
                        />
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
                            className="no-scrollbar dropdown-content z-[1] flex max-h-[150px] w-[200px] flex-col gap-y-2 overflow-y-auto rounded-box bg-base-100 p-2 text-sm shadow [&>li:hover]:bg-neutral/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
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
                            <li>
                              <span>Edit Order</span>
                            </li>
                            <li
                              onClick={() => trxDetailMisc(order.transaction)}
                            >
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
