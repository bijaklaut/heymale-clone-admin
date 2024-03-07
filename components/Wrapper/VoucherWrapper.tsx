"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductTypes, VoucherTypes } from "../../services/types";
import { getVouchers } from "../../services/admin";
import ComplexTableLoading from "../Loading/ComplexTableLoading";
import { initPagination } from "../../services/helper";
import VoucherTable from "../Tables/VoucherTable";
import PostVoucherModal from "../Modals/Voucher/PostVoucher";
import DeleteVoucherModal from "../Modals/Voucher/DeleteVoucher";
import VoucherConditionModal from "../Modals/Voucher/VoucherCondition";

const VoucherWrapper = () => {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isUpdate, setIsUpdate] = useState(false);
  const [products, setProducts] = useState<Partial<ProductTypes[]>>();
  const [isDelete, setIsDelete] = useState(false);
  const [condShow, setCondShow] = useState(false);
  const [detail, setDetail] = useState<VoucherTypes>();

  const getFilteredVoucher = useCallback(async (page: number) => {
    setLoading(true);
    const { payload } = await getVouchers(page);

    return setTimeout(() => {
      setLoading(false);
      setPagination(initPagination(payload.vouchers));
      setProducts(payload.products);
    }, 500);
  }, []);

  const updateMisc = useCallback((voucher: VoucherTypes) => {
    setIsUpdate(true);
    setDetail(voucher);
  }, []);

  const deleteMisc = useCallback((voucher: VoucherTypes) => {
    setIsDelete(true);
    setDetail(voucher);
  }, []);

  const conditionsMisc = useCallback((voucher: VoucherTypes) => {
    setCondShow(true);
    setDetail(voucher);
  }, []);

  // Search filter then reset pagination
  useEffect(() => {
    const pageParams = 1;
    // const query = queryGenerator(filters);

    getFilteredVoucher(pageParams);
  }, [changes]);

  // Pagination
  useEffect(() => {
    getFilteredVoucher(page);
  }, [page]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Voucher Dashboard</h2>
      <div className="mt-7 flex w-full flex-col gap-3 overflow-hidden py-3">
        <PostVoucherModal
          stateChanges={() => setChanges((prev) => !prev)}
          voucher={detail}
          isUpdate={isUpdate}
          reset={() => setIsUpdate(false)}
        />
        <DeleteVoucherModal
          stateChanges={() => setChanges((prev) => !prev)}
          isDelete={isDelete}
          deleteItem={detail}
          reset={() => setIsDelete(false)}
        />
        <VoucherConditionModal
          condItem={detail}
          isShow={condShow}
          products={products ? products : []}
          reset={() => setCondShow(false)}
        />
        {!loading ? (
          <VoucherTable
            paginate={pagination}
            paginateAction={(e) =>
              setPage(Number(e.currentTarget.dataset.page))
            }
            updateMisc={updateMisc}
            deleteMisc={deleteMisc}
            conditionsMisc={conditionsMisc}
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
