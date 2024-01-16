import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { CategoryTypes, ValidationTypes } from "../../services/types";
import { textInputHandler } from "../../services/helper";

interface SelectCategoryProps extends InputHTMLAttributes<HTMLSelectElement> {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  categories: CategoryTypes[];
  validations: ValidationTypes[];
}

const SelectInput = ({
  validations,
  dataState: { data, setData },
  label: [textLabel, fieldLabel, placeholder],
  categories,
}: SelectCategoryProps) => {
  const validation = validations.find((val) => val.field == fieldLabel);
  return (
    <label data-theme={"skies"} className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <select
        className="select select-bordered rounded-md"
        onChange={(e) => textInputHandler(e.target.value, "category", setData)}
        value={data.category ? data.category : ""}
      >
        <option disabled value={""}>
          {placeholder || "Select one option"}
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
        <span className="label-text-alt text-error">
          {validation?.message || ""}
        </span>
      </div>
    </label>
  );
};

export default SelectInput;
