import { ChangeEvent } from "react";
import { CategoryTypes, PostProductTypes } from "../../../services/types";

interface SelectCategoryProps {
  handler(event: ChangeEvent<HTMLSelectElement>): void;
  data: any;
  categories: CategoryTypes[];
  validation: { field: string; message: string }[];
}

const SelectCategory = (props: SelectCategoryProps) => {
  const { handler, validation, data, categories } = props;

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text text-white">Product Category</span>
      </div>
      <select
        className="h-10 rounded-md p-2 text-sm text-neutral"
        onChange={(e) => {
          handler(e);
        }}
        value={data.category ? data.category : ""}
      >
        <option disabled value={""}>
          Select Product Category
        </option>
        {categories.map((category: CategoryTypes, i: number) => {
          return (
            <option key={i} value={category._id}>
              {category.name}
            </option>
          );
        })}
      </select>
      <div className="label">
        {validation.length > 0
          ? validation.map((val, i) =>
              val.field == "category" ? (
                <span key={i} className="label-text-alt text-error">
                  {val.message}
                </span>
              ) : (
                ""
              ),
            )
          : ""}
      </div>
    </label>
  );
};

export default SelectCategory;
