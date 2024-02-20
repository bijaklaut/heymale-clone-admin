import { Fragment, useCallback, useEffect, useState } from "react";
import {
  capitalize,
  simpleModalHandler,
  transformDate,
  transformPaymentType,
  underscoreTransform,
} from "../../../services/helper";
import { ShipmentTypes, TransactionTypes } from "../../../services/types";
import cx from "classnames";
import NumFormatWrapper from "../../Wrapper/NumFormatWrapper";
import { getArea } from "../../../services/actions";

interface ThisProps {
  shipment?: Partial<ShipmentTypes>;
  isShow: string;
  reset(): void;
}

interface PopulateDetail {
  origin: {
    district: string;
    city: string;
    province: string;
    postal_code: string;
  };
  destination: {
    district: string;
    city: string;
    province: string;
    postal_code: string;
  };
}

const ShipmentDetailModal = ({ shipment, isShow, reset }: ThisProps) => {
  const [data, setData] = useState<PopulateDetail>();

  const getAddressDetail = useCallback(async () => {
    if (!shipment) {
      return null;
    }
    const originDetail = await getArea(shipment?.origin?.postal_code!);
    const destinationDetail = await getArea(
      shipment?.destination?.postal_code!,
    );
    const origin = {
      district: originDetail.areas[0].administrative_division_level_3_name,
      city: originDetail.areas[0].administrative_division_level_2_name,
      province: originDetail.areas[0].administrative_division_level_1_name,
      postal_code: originDetail.areas[0].postal_code,
    };
    const destination = {
      district: destinationDetail.areas[0].administrative_division_level_3_name,
      city: destinationDetail.areas[0].administrative_division_level_2_name,
      province: destinationDetail.areas[0].administrative_division_level_1_name,
      postal_code: destinationDetail.areas[0].postal_code,
    };

    setData((prev) => ({
      ...prev,
      origin,
      destination,
    }));
  }, [shipment]);

  useEffect(() => {
    if (isShow == "shipment" && shipment) {
      getAddressDetail();
      setTimeout(() => {
        simpleModalHandler("shipmentDetail", true);
        reset();
      }, 100);
    }
  }, [isShow]);

  return (
    <Fragment>
      <dialog
        data-theme="nord"
        id={"shipmentDetail"}
        className="modal text-black"
      >
        {shipment && (
          <div className="no-scrollbar modal-box absolute max-w-[600px] bg-neutral-100">
            <h3 className="modal-title mb-5">Shipment Detail</h3>
            <div className="mt-2 flex flex-col gap-y-5">
              <div className="grid grid-cols-1 gap-y-4 rounded-md bg-white p-4 shadow-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">
                      Shipping Order ID
                    </span>
                    <span>{shipment.shipment_order_id || "-"}</span>
                  </div>
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">Status</span>
                    <span>
                      {shipment.status
                        ? underscoreTransform(shipment.status)
                        : "-"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">Waybill ID</span>
                    <span>{shipment.courier?.waybill_id || "-"}</span>
                  </div>
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">Courier</span>
                    <span>{`${shipment.courier?.company.toUpperCase()} - ${shipment.courier?.type.toUpperCase()}`}</span>
                  </div>
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">Delivery Date</span>
                    <span>
                      {shipment.delivery?.datetime
                        ? new Date(shipment.delivery?.datetime).toDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1">
                    <span className="text-sm text-black/60">Shipping Fee</span>
                    <span>
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
                    </span>
                  </div>
                </div>
              </div>

              {/* Origin */}
              <div className="collapse collapse-arrow bg-white shadow-md">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-semibold">
                  Origin
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-1 gap-y-4">
                    <div className="grid grid-cols-2">
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Name</span>
                        <span>{shipment.origin?.contact_name}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Phone</span>
                        <span>{shipment.origin?.contact_phone}</span>
                      </div>
                    </div>
                    <div className="mb-1 grid grid-cols-1">
                      <span className="text-sm text-black/60">Address</span>
                      <span>{shipment.origin?.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">
                          Postal Code
                        </span>
                        <span>{data?.origin.postal_code}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">District</span>
                        <span>{data?.origin.district}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">City</span>
                        <span>{data?.origin.city}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Province</span>
                        <span>{data?.origin.province}</span>
                      </div>
                    </div>
                    <div className="mb-1 grid grid-cols-1">
                      <span className="text-sm text-black/60">Note</span>
                      <span>{shipment.origin?.note}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="collapse collapse-arrow bg-white shadow-md">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-semibold">
                  Destination
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-1 gap-y-4">
                    <div className="grid grid-cols-2">
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Name</span>
                        <span>{shipment.destination?.contact_name}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Phone</span>
                        <span>{shipment.destination?.contact_phone}</span>
                      </div>
                    </div>
                    <div className="mb-1 grid grid-cols-1">
                      <span className="text-sm text-black/60">Address</span>
                      <span>{shipment.destination?.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">
                          Postal Code
                        </span>
                        <span>{data?.destination.postal_code}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">District</span>
                        <span>{data?.destination.district}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">City</span>
                        <span>{data?.destination.city}</span>
                      </div>
                      <div className="grid grid-cols-1">
                        <span className="text-sm text-black/60">Province</span>
                        <span>{data?.destination.province}</span>
                      </div>
                    </div>
                    <div className="mb-1 grid grid-cols-1">
                      <span className="text-sm text-black/60">Note</span>
                      <span>{shipment.destination?.note}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Item */}
              <div className="collapse collapse-arrow bg-white shadow-md">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-semibold">
                  Items
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-2 justify-center gap-4 [&>*:last-child:not(:nth-child(even))]:col-span-2 ">
                    {shipment.items ? (
                      shipment.items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 rounded-md border-2 p-2"
                        >
                          <div>{item?.name}</div>
                          <div className="text-sm text-black/60">
                            {`Value: `}
                            <NumFormatWrapper
                              value={item?.value}
                              displayType="text"
                              prefix="Rp. "
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                            {` x ${item?.quantity} pcs`}
                          </div>
                          <div className="text-sm text-black/60">{`Weight: ${item?.weight} gr/pcs`}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2">
                        {`There is nothing to show`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => simpleModalHandler("shipmentDetail", false)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </dialog>
    </Fragment>
  );
};

export default ShipmentDetailModal;
