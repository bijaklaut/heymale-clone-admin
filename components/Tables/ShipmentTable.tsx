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
  docs: ShipmentTypes[];
}

interface ThisProps {
  paginate: OrderPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
  itemsDetailMisc(items: OrderItemTypes[]): void;
  trxDetailMisc(transaction: Partial<TransactionTypes>): void;
  shipmentDetailMisc(shipment: Partial<ShipmentTypes>): void;
}

const ShipmentTable = ({
  paginate,
  paginateAction,
  stateChanges,
  itemsDetailMisc,
  trxDetailMisc,
  shipmentDetailMisc,
}: ThisProps) => {
  const { docs: shipments } = paginate;
  const statusClass = useCallback((status: string) => {
    return cx({
      "w-fit badge badge-outline font-semibold py-3": status,
      "xl:text-primary": status == "delivered",
      "xl:text-error": status == "courier_not_found",
      "xl:text-success": status == "placed",
    });
  }, []);

  return (
    <div className="min-h-screen max-w-[1920px]">
      {shipments.length ? (
        <Fragment>
          <div className="rounded-md bg-transparent xl:bg-neutral-100 xl:px-3 xl:py-5">
            <div className="mb-4 hidden grid-cols-[50px_minmax(200px,_1fr)_minmax(min-content,_1fr)_150px_200px_200px_150px_50px] items-center justify-items-center gap-x-2 font-semibold text-black/60 xl:grid">
              <div className="">#</div>
              <div className="flex flex-col items-center">
                <span>Shipment Order ID</span>
                <span className="text-sm font-normal">Invoice</span>
              </div>
              <div>Waybill ID</div>
              <div>Delivery Date</div>
              <div>Status</div>
              <div>Recipient</div>
              <div>Shipping Fee</div>
              <div></div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {shipments.map((shipment, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-[50px_minmax(200px,_1fr)_minmax(min-content,_1fr)_150px_200px_200px_150px_50px] items-center gap-2 rounded-md bg-white py-3 text-center text-neutral shadow-md"
                  >
                    <div>{paginate.pagingCounter + index}</div>
                    <div>
                      <span>{shipment.reference_id || "-"}</span>
                    </div>
                    <div>{shipment.courier.waybill_id || "-"}</div>
                    <div>
                      {shipment.delivery.datetime
                        ? new Date(shipment.delivery.datetime).toDateString()
                        : "-"}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className={statusClass(shipment.status)}>
                        {shipment.status
                          ? underscoreTransform(shipment.status)
                          : "-"}
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
                                <span>{capitalize(order.status)}</span>
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
                    <div className="flex flex-col">
                      <span>{shipment.destination.contact_name}</span>
                      <span className="text-sm">
                        Contact: {shipment.destination.contact_phone}
                      </span>
                    </div>
                    <div>
                      {shipment.price ? (
                        <NumFormatWrapper
                          value={shipment.price}
                          displayType="text"
                          prefix="Rp. "
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      ) : (
                        "-"
                      )}
                    </div>
                    {/* <div>
                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => itemsDetailMisc(order.order_item)}
                      >
                        See Details
                      </button>
                    </div> */}

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
                          <li onClick={() => shipmentDetailMisc(shipment)}>
                            <span>Shipment Details</span>
                          </li>
                          <li>
                            <span>More Actions</span>
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
          <NoDisplay text="There's no shipments to display" />
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;
