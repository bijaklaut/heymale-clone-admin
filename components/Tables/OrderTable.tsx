"use client";
import { Fragment, MouseEventHandler } from "react";
import {
  CategoryTypes,
  OrderTypes,
  PaginationTypes,
} from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import DeleteCategoryModal from "../Modals/Category/DeleteCategory";
import UpdateCategoryModal from "../Modals/Category/UpdateCategory";
import Pagination from "../Misc/Pagination";

interface OrderPagination extends PaginationTypes {
  docs: OrderTypes[];
}

interface ThisProps {
  paginate: OrderPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
}

const OrderTable = ({ paginate, paginateAction, stateChanges }: ThisProps) => {
  const { docs: orders } = paginate;

  return (
    <div className="max-w-[1920px]">
      {/* {categories.length ? (
        <Fragment>
          
          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no orders to display" />
        )} */}
      <NoDisplay text="There's no orders to display" />
    </div>
  );
};

export default OrderTable;
