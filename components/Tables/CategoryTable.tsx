import { getCategories } from "../../services/admin";
import { CategoryTypes } from "../../services/types";
import DeleteCategoryModal from "../Modals/Category/DeleteCategory";
import UpdateCategoryModal from "../Modals/Category/UpdateCategory";

const CategoryTable = (props: { categories: CategoryTypes[] }) => {
  const { categories } = props;

  return (
    <div data-theme="nord" className="mt-3 max-w-3xl rounded-md py-3">
      <table className="table">
        <thead>
          <tr>
            <th className="w-[75px] text-base font-semibold">#</th>
            <th className="w-[500px] text-base font-semibold">Category Name</th>
            <th className="text-base font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: CategoryTypes, i: any) => {
            return (
              <tr key={i} className="hover">
                <th className="">{i + 1}</th>
                <td>{category.name}</td>
                <td className="flex gap-x-2">
                  <UpdateCategoryModal category={category} index={i} />
                  <DeleteCategoryModal category={category} index={i} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
