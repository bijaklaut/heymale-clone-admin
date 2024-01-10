"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FilterTypes, CategoryTypes, ProductTypes } from "../../services/types";
import { getCategories, getProducts } from "../../services/admin";
import ProductTable from "../Tables/ProductTable";
import CreateProductModal from "../Modals/Product/CreateProduct";
import SearchFilter from "../Misc/SearchFilter";
import ComplexTableLoading from "../Loading/ComplexTableLoading";
import AddCategoryModal from "../Modals/Category/CreateCategory";
import CategoryTable from "../Tables/CategoryTable";
import SimpleTableLoading from "../Loading/SimpleTableLoading";

// interface ThisProps {
//   categories: CategoryTypes[];
// }

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

const CategoryTableWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);
  const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setLoading(true);
  };
  const pageHandler = (pageNumber: number) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    const getFiltered = async (search: string, page: number) => {
      const { payload } = await getCategories(search, page);

      setPagination(initialPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    };
    const pageParams = 1;

    getFiltered(search, pageParams);
  }, [search, changes]);

  useEffect(() => {
    const getFiltered = async (search: string, page: number) => {
      const { payload } = await getCategories(search, page);

      setPagination(initialPagination(payload));
    };

    getFiltered(search, page);
  }, [page]);

  return (
    <>
      <AddCategoryModal stateChanges={stateChanges} />

      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <SearchFilter
          data={{ search }}
          changeSearch={changeSearch}
          withFilter={false}
          placeholder="Search category by name"
        />
        {!loading ? (
          <CategoryTable
            pageHandler={pageHandler}
            stateChanges={stateChanges}
            paginate={pagination}
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </>
  );
};

export default CategoryTableWrapper;
