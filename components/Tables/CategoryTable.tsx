"use client";
import { Fragment, MouseEventHandler } from "react";
import { CategoryTypes, PaginationTypes } from "../../services/types";
import NoDisplay from "../Misc/NoDisplay";
import DeleteCategoryModal from "../Modals/Category/DeleteCategory";
import UpdateCategoryModal from "../Modals/Category/UpdateCategory";
import Pagination from "../Misc/Pagination";

interface CategoryPagination extends PaginationTypes {
  docs: CategoryTypes[];
}

interface ThisProps {
  paginate: CategoryPagination;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  stateChanges(): void;
}

const CategoryTable = ({
  paginate,
  paginateAction,
  stateChanges,
}: ThisProps) => {
  const { docs: categories } = paginate;

  return (
    <div className="max-w-3xl">
      {categories.length ? (
        <Fragment>
          <table data-theme="nord" className="table w-full rounded-md">
            <thead>
              <tr>
                <th className="text-base font-semibold sm:w-[75px]">#</th>
                <th className="text-base font-semibold">Category Name</th>
                <th className="w-[100px] text-center text-base font-semibold sm:w-[150px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: CategoryTypes, i: any) => {
                return (
                  <tr key={i}>
                    <th className="">{i + paginate.pagingCounter}</th>
                    <td>{category.name}</td>
                    <td className="flex w-full justify-center gap-x-2">
                      <UpdateCategoryModal
                        category={category}
                        index={i}
                        stateChanges={stateChanges}
                      />
                      <DeleteCategoryModal
                        category={category}
                        index={i}
                        stateChanges={stateChanges}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no category to display" />
      )}
    </div>
  );
};

export default CategoryTable;
