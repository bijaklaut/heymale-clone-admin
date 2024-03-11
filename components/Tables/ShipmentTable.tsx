"use client";
import { Fragment, MouseEventHandler, useCallback } from "react";
import {
  OrderItemTypes,
  PaginationTypes,
  ShipmentTypes,
  TransactionTypes,
} from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { OptionDotSvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import cx from "classnames";
import { underscoreTransform } from "../../services/helper";

interface OrderPagination extends PaginationTypes {
  docs: ShipmentTypes[];
}

interface ThisProps {
  paginate: OrderPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
  shipmentDetailMisc(shipment: Partial<ShipmentTypes>): void;
}

const ShipmentTable = ({
  paginate,
  paginateAction,
  shipmentDetailMisc,
}: ThisProps) => {
  const { docs: shipments } = paginate;
  const statusClass = useCallback((status: string) => {
    return cx({
      "w-fit badge badge-outline font-semibold py-3": true,
      "text-primary": status == "delivered",
      "text-error": errorStatus.includes(status),
      "text-accent": ongoingStatus.includes(status),
      "text-black/60": !status,
    });
  }, []);

  return (
    <div className="max-w-[1920px]">
      {shipments.length ? (
        <Fragment>
          <div data-theme="nord" className="overflow-auto rounded-md">
            <table className="table border-separate border-spacing-y-2 p-2">
              {/* head */}
              <thead>
                <tr className="text-base [&>th]:text-center [&>th]:font-semibold">
                  <th className="">#</th>
                  <th className="min-w-[150px]">Invoice</th>
                  <th className="min-w-[150px]">Waybill ID</th>
                  <th className="min-w-[150px]">Delivery Date</th>
                  <th className="min-w-[180px]">Status</th>
                  <th className="min-w-[200px]">Recipient</th>
                  <th className="min-w-[100px]">Shipping Fee</th>
                  <th className="min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="[&>tr:first-child>td:last-child>div]:dropdown-bottom [&>tr:last-child>td:last-child>div]:dropdown-top [&>tr]:rounded-md">
                {shipments.map((shipment, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white shadow-sm [&>td]:text-center "
                    >
                      <td className="min-w-[50px]">
                        {paginate.pagingCounter + index}
                      </td>
                      <td className="min-w-[150px]">
                        {shipment.reference_id || "-"}
                      </td>
                      <td className="min-w-[150px]">
                        {shipment.courier.waybill_id || "-"}
                      </td>
                      <td className="min-w-[150px]">
                        {shipment.delivery.datetime
                          ? new Date(shipment.delivery.datetime).toDateString()
                          : "-"}
                      </td>
                      <td className="min-w-[180px]">
                        <div
                          data-theme="skies"
                          className={statusClass(shipment.status)}
                        >
                          {shipment.status
                            ? underscoreTransform(shipment.status)
                            : "Pending"}
                        </div>
                      </td>
                      <td className="min-w-[200px]">
                        <div className="flex flex-col">
                          <span>{shipment.destination.contact_name}</span>
                          <span className="text-sm">
                            Contact: {shipment.destination.contact_phone}
                          </span>
                        </div>
                      </td>
                      <td className="min-w-[100px]">
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
                            className="no-scrollbar dropdown-content absolute -top-10 z-[1] flex w-[200px] flex-col gap-y-2 rounded-box bg-base-100 p-2 text-sm shadow [&>li:hover]:bg-neutral/10 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:p-2 [&>li]:transition-all"
                          >
                            <li onClick={() => shipmentDetailMisc(shipment)}>
                              <span>Shipment Details</span>
                            </li>
                            <li>
                              <span>More Actions</span>
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
          <NoDisplay text="There's no shipments to display" />
        </div>
      )}
    </div>
  );
};

const errorStatus = [
  "failure",
  "courier_not_found",
  "cancelled",
  "rejected",
  "disposed",
  "returned",
];

const ongoingStatus = [
  "placed",
  "confirmed",
  "allocated",
  "picking_up",
  "picked",
  "dropping_off",
  "return_in_transit",
  "delivered",
];

export default ShipmentTable;
