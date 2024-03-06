"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getOrderDetail } from "../../services/admin";
import { OrderTypes } from "../../services/types";
import PendingOrder from "../Misc/PendingOrder";

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
      {order?.status == "pending" && <PendingOrder order={order} />}
    </Fragment>
  );
};

export default OrderDetailWrapper;
