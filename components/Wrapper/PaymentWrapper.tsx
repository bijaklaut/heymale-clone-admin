"use client";

import { useEffect, useState, Fragment, useCallback } from "react";
import { getPayments } from "../../services/admin";
import SearchFilter from "../Misc/SearchFilter";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import PaymentTable from "../Tables/PaymentTable";
import CreatePaymentModal from "../Modals/Payment/CreatePayment";
import { initPagination } from "../../services/helper";

const PaymentWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);

  const getFilteredPayment = useCallback(
    async (page: number) => {
      setLoading(true);
      const { payload } = await getPayments(search, page);

      setPagination(initPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    },
    [search, changes],
  );

  useEffect(() => {
    const pageParams = 1;

    getFilteredPayment(pageParams);
  }, [search, changes]);

  useEffect(() => {
    getFilteredPayment(page);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-2xl font-semibold">Payment Dashboard</h2>

      <div className="mt-7 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <CreatePaymentModal stateChanges={stateChanges} />
        <SearchFilter
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by account number"
        />
        {!loading ? (
          <PaymentTable
            stateChanges={stateChanges}
            paginate={pagination}
            paginateAction={(e) =>
              setPage(Number(e.currentTarget.dataset.page))
            }
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </Fragment>
  );
};

export default PaymentWrapper;
