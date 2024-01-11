"use client";

import { ChangeEvent, useEffect, useState, Fragment } from "react";
import { getPayments } from "../../services/admin";
import SearchFilter from "../Misc/SearchFilter";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import PaymentTable from "../Tables/PaymentTable";
import CreatePaymentModal from "../Modals/Payment/CreatePayment";

const initialPagination = (payload?: any) => {
  return {
    docs: payload?.docs || [],
    page: payload?.page || 1,
    totalPages: payload?.totalPages || 1,
    pagingCounter: payload?.pagingCounter || 1,
    hasPrevPage: payload?.hasPrevPage || false,
    hasNextPage: payload?.hasNextPage || false,
    prevPage: payload?.prevPage || null,
    nextPage: payload?.nextPage || null,
  };
};

const PaymentWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);
  const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setLoading(true);
  };

  useEffect(() => {
    const getFiltered = async (search: string, page: number) => {
      const { payload } = await getPayments(search, page);

      setPagination(initialPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    };
    const pageParams = 1;

    getFiltered(search, pageParams);
  }, [search, changes]);

  useEffect(() => {
    const getFiltered = async (search: string, page: number) => {
      const { payload } = await getPayments(search, page);

      setPagination(initialPagination(payload));
    };

    getFiltered(search, page);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-2xl font-semibold">Payment Dashboard</h2>
      <CreatePaymentModal stateChanges={stateChanges} />

      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <SearchFilter
          data={{ search }}
          changeSearch={changeSearch}
          withFilter={false}
          placeholder="Search by account number"
        />
        {!loading ? (
          <PaymentTable
            pageHandler={pageHandler}
            stateChanges={stateChanges}
            paginate={pagination}
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </Fragment>
  );
};

export default PaymentWrapper;
