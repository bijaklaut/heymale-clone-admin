"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryTypes } from "../../services/types";
import { getProducts } from "../../services/admin";
import ProductTable from "../Tables/ProductTable";
import CreateProductModal from "../Modals/Product/CreateProduct";
import SearchFilter from "../Misc/SearchFilter";
import ComplexTableLoading from "../Loading/ComplexTableLoading";
import {
  initCriteria,
  initPagination,
  queryGenerator,
} from "../../services/helper";

interface ThisProps {
  categories: CategoryTypes[];
}

const ProductWrapper = (props: ThisProps) => {
  const { categories } = props;
  const [filters, setFilters] = useState(
    initCriteria(categories || [], "name"),
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);
  const getFilteredProduct = useCallback(
    async (page: number, data: { query: string; search: string }) => {
      setLoading(true);
      const { payload } = await getProducts(page, data);

      return setTimeout(() => {
        setLoading(false);
        setPagination(initPagination(payload));
      }, 500);
    },
    [search, filters, page, changes],
  );

  // Search filter then reset pagination
  useEffect(() => {
    const pageParams = 1;
    const query = queryGenerator(filters);

    getFilteredProduct(pageParams, { query, search });
  }, [filters, search, changes]);

  // Pagination
  useEffect(() => {
    const query = queryGenerator(filters);

    getFilteredProduct(page, { query, search });
  }, [page]);

  return (
    <>
      <h2 className="text-2xl font-semibold">Product Dashboard</h2>
      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <CreateProductModal
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
              pageHandler(Number(e.currentTarget.dataset.page))
            }
          />
        ) : (
          <ComplexTableLoading />
        )}
      </div>
    </>
  );
};

export default ProductWrapper;
