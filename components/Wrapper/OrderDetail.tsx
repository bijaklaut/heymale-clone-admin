"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getOrderDetail } from "../../services/admin";
import { OrderTypes } from "../../services/types";
import PendingOrder from "../Misc/PendingOrder";
import LoadingSpin from "../Loading/LoadingSpin";
import { InfoSvg } from "../Misc/SvgGroup";

interface ThisProps {
  invoice: string;
}

const OrderDetailWrapper = ({ invoice }: ThisProps) => {
  const [order, setOrder] = useState<OrderTypes>();

  const getOrderDetailAPI = useCallback(async () => {
    const { payload } = await getOrderDetail(invoice, true);
    setOrder(payload);
  }, [invoice]);

  useEffect(() => {
    getOrderDetailAPI();
  }, [invoice]);

  return (
    <Fragment>
      {order ? (
        order?.status == "pending" ? (
          <PendingOrder order={order} />
        ) : (
          <div className="absolute left-1/2 top-1/2 flex h-fit w-fit -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center gap-2 rounded-md bg-base-300 p-10 text-lg font-semibold text-white">
            <InfoSvg className="h-8 w-8 stroke-current" />
            <span>Page doesn't available for this order</span>
          </div>
        )
      ) : (
        <LoadingSpin />
      )}
    </Fragment>
  );
};

export default OrderDetailWrapper;
