"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryTypes } from "../../services/types";
import { getProducts, getVouchers } from "../../services/admin";
import ProductTable from "../Tables/ProductTable";
import CreateProductModal from "../Modals/Product/CreateProduct";
import SearchFilter from "../Misc/SearchFilter";
import ComplexTableLoading from "../Loading/ComplexTableLoading";
import {
  initCriteria,
  initPagination,
  queryGenerator,
} from "../../services/helper";
import VoucherTable from "../Tables/VoucherTable";

interface ThisProps {
  // categories: CategoryTypes[];
}

const VoucherWrapper = (props: ThisProps) => {
  // const { categories } = props;
  // // const [filters, setFilters] = useState(
  // //   initCriteria(categories || [], "name"),
  // // );
  // const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const stateChanges = () => setChanges((prev) => !prev);

  const getFilteredVoucher = useCallback(async () => {
    setLoading(true);
    const { payload } = await getVouchers();

    return setTimeout(() => {
      setLoading(false);
      setPagination(initPagination(payload));
    }, 500);
  }, []);

  // // Search filter then reset pagination
  // useEffect(() => {
  //   const pageParams = 1;
  //   const query = queryGenerator(filters);

  //   getFilteredProduct(pageParams, { query, search });
  // }, [filters, search, changes]);

  // Pagination
  useEffect(() => {
    // const query = queryGenerator(filters);

    getFilteredVoucher();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-semibold">Voucher Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-hidden py-3">
        <VoucherTable
          stateChanges={stateChanges}
          paginate={pagination}
          paginateAction={(e) => setPage(Number(e.currentTarget.dataset.page))}
        />
        {/* <CreateProductModal
          categories={categories}
          stateChanges={stateChanges}
        />
        <SearchFilter
          search={search}
          filterData={{ filters, setFilters }}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product by name"
        />
        {!loading ? (
          <ProductTable
            categories={categories}
            filters={filters}
            stateChanges={stateChanges}
            paginate={pagination}
            paginateAction={(e) =>
              setPage(Number(e.currentTarget.dataset.page))
            }
          />
        ) : (
          <ComplexTableLoading />
        )} */}
      </div>
    </>
  );
};

export default VoucherWrapper;
