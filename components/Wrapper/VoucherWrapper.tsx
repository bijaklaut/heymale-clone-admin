"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryTypes, VoucherTypes } from "../../services/types";
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
import PostVoucherModal from "../Modals/Voucher/PostVoucher";
import DeleteVoucherModal from "../Modals/Voucher/DeleteVoucher";

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

  const [isUpdate, setIsUpdate] = useState(false);
  const [updateVoucher, setUpdateVoucher] = useState<VoucherTypes>();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteVoucher, setDeleteVoucher] = useState<VoucherTypes>();

  const getFilteredVoucher = useCallback(async () => {
    setLoading(true);
    const { payload } = await getVouchers();

    return setTimeout(() => {
      setLoading(false);
      setPagination(initPagination(payload));
    }, 500);
  }, []);

  const updateMisc = useCallback((voucher: VoucherTypes) => {
    setUpdateVoucher(voucher);
    setIsUpdate(true);
  }, []);

  const deleteMisc = useCallback((voucher: VoucherTypes) => {
    setIsDelete(true);
    setDeleteVoucher(voucher);
  }, []);

  // Search filter then reset pagination
  useEffect(() => {
    // const pageParams = 1;
    // const query = queryGenerator(filters);

    getFilteredVoucher();
  }, [changes]);

  // Pagination
  useEffect(() => {
    // const query = queryGenerator(filters);

    getFilteredVoucher();
  }, []);

  const resetDelete = useCallback(() => setIsDelete(false), []);

  return (
    <>
      <h2 className="text-3xl font-semibold">Voucher Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-hidden py-3">
        <PostVoucherModal
          stateChanges={() => setChanges((prev) => !prev)}
          voucher={updateVoucher}
          isUpdate={isUpdate}
          reset={() => setIsUpdate(false)}
        />
        <DeleteVoucherModal
          stateChanges={() => setChanges((prev) => !prev)}
          isDelete={isDelete}
          deleteItem={deleteVoucher}
          reset={resetDelete}
        />
        {!loading ? (
          <VoucherTable
            paginate={pagination}
            paginateAction={(e) =>
              setPage(Number(e.currentTarget.dataset.page))
            }
            updateMisc={updateMisc}
            deleteMisc={deleteMisc}
          />
        ) : (
          <ComplexTableLoading />
        )}

        {/*
        <SearchFilter
          search={search}
          filterData={{ filters, setFilters }}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product by name"
        />
        */}
      </div>
    </>
  );
};

export default VoucherWrapper;
