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
import cx from "classnames";

const OrderWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState("none");
  const [filter, setFilter] = useState("all");

  const [itemsDetail, setItemsDetail] = useState<OrderItemTypes[]>();
  const [trxDetail, setTrxDetail] = useState<Partial<TransactionTypes>>();
  const [shipmentDetail, setShipmentDetail] =
    useState<Partial<ShipmentTypes>>();

  const stateChanges = () => setChanges((prev) => !prev);
  const tabHandler = useCallback((tab: string) => setFilter(tab), []);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);

  const activeTab = useCallback((active: string, value: string) => {
    return cx({
      "btn btn-sm text-white": true,
      "bg-base-300 hover:bg-base-200": active != value,
      "btn-accent": active == value,
    });
  }, []);

  const getFilteredOrders = useCallback(
    async (page: number, data: { filter: string; search: string }) => {
      try {
        setLoading(true);
        const { payload } = await getOrders(page, data);

        setPagination(initPagination(payload));
      } catch (error) {
        setPagination(initPagination());
      } finally {
        return setTimeout(() => setLoading(false), 500);
      }
    },
    [],
  );

  // Search filter then reset pagination
  useEffect(() => {
    const resetPage = 1;

    getFilteredOrders(resetPage, { filter, search });
  }, [filter, search, changes]);

  // Pagination
  useEffect(() => {
    getFilteredOrders(page, { filter, search });
  }, [page]);

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
        <div className="my-3 flex gap-2">
          <div
            className={activeTab(filter, "all")}
            onClick={() => tabHandler("all")}
          >
            All
          </div>
          <div
            className={activeTab(filter, "pending")}
            onClick={() => tabHandler("pending")}
          >
            Pending
          </div>
          <div
            className={activeTab(filter, "settlement")}
            onClick={() => tabHandler("settlement")}
          >
            Paid
          </div>
          <div
            className={activeTab(filter, "ongoing")}
            onClick={() => tabHandler("ongoing")}
          >
            On-going
          </div>
          <div
            className={activeTab(filter, "completed")}
            onClick={() => tabHandler("completed")}
          >
            Completed
          </div>
          <div
            className={activeTab(filter, "failed")}
            onClick={() => tabHandler("failed")}
          >
            Failed
          </div>
        </div>
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
            tabHandler={(tab) => setFilter(tab)}
            activeTab={filter}
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </Fragment>
  );
};

export default OrderWrapper;
