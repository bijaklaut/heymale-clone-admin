"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FilterTypes, CategoryTypes, ProductTypes } from "../../services/types";
import { getProducts } from "../../services/admin";
import ProductTable from "../Tables/ProductTable";
import CreateProductModal from "../Modals/Product/CreateProduct";
import SearchFilter from "../Misc/SearchFilter";
import ComplexTableLoading from "../Loading/ComplexTableLoading";

interface ThisProps {
  categories: CategoryTypes[];
}

const initialCriteria = (categories: CategoryTypes[]) => {
  let returnValue: FilterTypes[] = [];

  categories.map((category) => {
    return returnValue.push({ name: category.name, include: true });
  });

  return returnValue;
};
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
const queryGenerator = (filters: FilterTypes[]) => {
  let joinArray: string[] = [];
  filters
    .filter((crit) => crit.include)
    .map((crit) => joinArray.push(crit.name));

  return `((^)(${joinArray.join("|")}))+$` || "";
};

const ProductTableWrapper = (props: ThisProps) => {
  const { categories } = props;
  const [filters, setFilters] = useState(initialCriteria(categories || []));
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
  const changeFilter = (filters: FilterTypes[], filter: FilterTypes) => {
    let copyFilter = [...filters];
    copyFilter.map((copy) => {
      if (copy.name == filter.name) return (copy.include = !copy.include);
    });

    setFilters(copyFilter);
    setLoading(true);
  };
  const pageHandler = (pageNumber: number) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    const getFiltered = async (
      page: number,
      data: { query: string; search: string },
    ) => {
      const { payload } = await getProducts(page, data);

      setPagination(initialPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    };
    const pageParams = 1;
    const query = queryGenerator(filters);

    getFiltered(pageParams, { query, search });
  }, [filters, search, changes]);

  useEffect(() => {
    const getFiltered = async (
      page: number,
      data: { query: string; search: string },
    ) => {
      const { payload } = await getProducts(page, data);

      setPagination(initialPagination(payload));
    };
    const query = queryGenerator(filters);

    getFiltered(page, { query, search });
  }, [page]);

  return (
    <>
      <CreateProductModal categories={categories} stateChanges={stateChanges} />

      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <SearchFilter
          data={{ filters, search }}
          changeSearch={changeSearch}
          changeFilter={changeFilter}
        />
        {!loading ? (
          <ProductTable
            categories={categories}
            filters={filters}
            stateChanges={stateChanges}
            paginate={pagination}
            pageHandler={pageHandler}
            // stateLoading={stateLoading}
          />
        ) : (
          <ComplexTableLoading />
        )}
      </div>
    </>
  );
};

export default ProductTableWrapper;
