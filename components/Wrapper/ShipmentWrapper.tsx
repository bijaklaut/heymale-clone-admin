"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getOrders, getShipments } from "../../services/admin";
import SearchFilter from "../Misc/SearchFilter";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import { initPagination } from "../../services/helper";
import OrderTable from "../Tables/OrderTable";
import {
  OrderItemTypes,
  ShipmentTypes,
  TransactionTypes,
} from "../../services/types";
import OrderItemModal from "../Modals/Order/OrderItem";
import TransactionDetailModal from "../Modals/Order/TransactionDetail";
import ShipmentDetailModal from "../Modals/Order/ShipmentDetail";
import ShipmentTable from "../Tables/ShipmentTable";

const ShipmentWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState("none");

  const [itemsDetail, setItemsDetail] = useState<OrderItemTypes[]>();
  const [trxDetail, setTrxDetail] = useState<Partial<TransactionTypes>>();
  const [shipmentDetail, setShipmentDetail] =
    useState<Partial<ShipmentTypes>>();

  const stateChanges = () => setChanges((prev) => !prev);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);
  const getFilteredShipment = useCallback(
    async (page?: number, search?: string) => {
      setLoading(true);
      const { payload } = await getShipments();

      setPagination(initPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    },
    [search, page, changes],
  );

  // Search filter then reset pagination
  // useEffect(() => {
  //   const pageParams = 1;

  //   getFilteredShipment(search, pageParams);
  // }, [search, changes]);

  const itemsDetailMisc = useCallback((items: OrderItemTypes[]) => {
    setDetailModal("items");
    setItemsDetail(items);
  }, []);

  const trxDetailMisc = useCallback(
    (transaction: Partial<TransactionTypes>) => {
      setTrxDetail(transaction);
      setDetailModal("transaction");
    },
    [],
  );

  const shipmentDetailMisc = useCallback((shipment: Partial<ShipmentTypes>) => {
    setShipmentDetail(shipment);
    setDetailModal("shipment");
  }, []);

  // Pagination
  useEffect(() => {
    getFilteredShipment(page, search);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-3xl font-semibold">Shipment Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <ShipmentDetailModal
          isShow={detailModal}
          shipment={shipmentDetail}
          reset={() => setDetailModal("none")}
        />
        {!loading ? (
          <ShipmentTable
            stateChanges={stateChanges}
            paginate={pagination}
            paginateAction={(e) =>
              pageHandler(Number(e.currentTarget.dataset.page))
            }
            itemsDetailMisc={itemsDetailMisc}
            trxDetailMisc={trxDetailMisc}
            shipmentDetailMisc={shipmentDetailMisc}
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </Fragment>
  );
};

export default ShipmentWrapper;
