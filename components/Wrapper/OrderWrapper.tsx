"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getOrders } from "../../services/admin";
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
import CatalogProductModal from "../Modals/Order/Catalog";

const OrderWrapper = () => {
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
  const getFilteredOrders = useCallback(
    async (page?: number, search?: string) => {
      setLoading(true);
      const { payload } = await getOrders();
      setPagination(initPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    },
    [search, page, changes],
  );

  // Search filter then reset pagination
  // useEffect(() => {
  //   const pageParams = 1;

  //   getFilteredOrders(search, pageParams);
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
    getFilteredOrders(page, search);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-3xl font-semibold">Order Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <CatalogProductModal
          stateChanges={() => setChanges((prev) => !prev)}
          isUpdate={false}
          reset={() => null}
        />
        <OrderItemModal
          isShow={detailModal}
          orderItems={itemsDetail}
          reset={() => setDetailModal("none")}
        />
        <TransactionDetailModal
          isShow={detailModal}
          transaction={trxDetail}
          reset={() => setDetailModal("none")}
        />
        <ShipmentDetailModal
          isShow={detailModal}
          shipment={shipmentDetail}
          reset={() => setDetailModal("none")}
        />
        {/* <SearchFilter
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category by name"
        /> */}
        {!loading ? (
          <OrderTable
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

export default OrderWrapper;
