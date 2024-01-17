"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getCategories } from "../../services/admin";
import SearchFilter from "../Misc/SearchFilter";
import CategoryTable from "../Tables/CategoryTable";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import CreateCategoryModal from "../Modals/Category/CreateCategory";
import { initPagination } from "../../services/helper";

const CategoryWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateChanges = () => setChanges((prev) => !prev);
  const pageHandler = (pageNumber: number) => setPage(pageNumber);
  const getFilteredCategory = useCallback(
    async (search: string, page: number) => {
      setLoading(true);
      const { payload } = await getCategories(search, page);

      setPagination(initPagination(payload));
      return setTimeout(() => setLoading(false), 500);
    },
    [search, page, changes],
  );

  // Search filter then reset pagination
  useEffect(() => {
    const pageParams = 1;

    getFilteredCategory(search, pageParams);
  }, [search, changes]);

  // Pagination
  useEffect(() => {
    getFilteredCategory(search, page);
  }, [page]);

  return (
    <Fragment>
      <h2 className="text-3xl font-semibold">Category Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <CreateCategoryModal stateChanges={stateChanges} />
        <SearchFilter
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category by name"
        />
        {!loading ? (
          <CategoryTable
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

export default CategoryWrapper;
