import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { ValidationTypes } from "../../services/types";
import { textInputHandler } from "../../services/helper";

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement> {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  selectionData: any[];
  validations: ValidationTypes[];
}

const SelectInput = ({
  validations,
  dataState: { data, setData },
  label: [textLabel, fieldLabel, placeholder],
  selectionData,
}: SelectInputProps) => {
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
        {selectionData.map((item: any, i: number) => {
          return (
            <option key={i} value={item._id}>
              {item.name}
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
