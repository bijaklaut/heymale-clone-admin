"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getTransactions } from "../../services/admin";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import { initPagination } from "../../services/helper";
import TransactionTable from "../Tables/TransactionTable";

const TransactionWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);
  const getFilteredTransaction = useCallback(async (page?: number) => {
    setLoading(true);
    const { payload } = await getTransactions(page);

    setPagination(initPagination(payload));
    return setTimeout(() => setLoading(false), 500);
  }, []);

  // Pagination
  useEffect(() => {
    getFilteredTransaction(page);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-3xl font-semibold">Transaction Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        {!loading ? (
          <TransactionTable
            stateChanges={stateChanges}
            paginate={pagination}
            paginateAction={(e) =>
              pageHandler(Number(e.currentTarget.dataset.page))
            }
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </Fragment>
  );
};

export default TransactionWrapper;
