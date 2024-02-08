import { InputHTMLAttributes } from "react";
import { ValidationTypes } from "../../../services/types";

interface ThisProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string[];
  validations: ValidationTypes[];
}

const ConditionsSelect = ({
  label,
  validations,
  onChange,
  value,
}: ThisProps) => {
  const [textLabel, fieldLabel, placeholder] = label;
  const validation = validations.filter((val) => val.field == fieldLabel)[0];

  return (
    <label className="form-control mx-auto w-full max-w-xs">
      <div className="label">
        <span className="label-text -ms-1 w-full text-center text-base text-white">
          {textLabel}
        </span>
      </div>
      <select
        className="select select-bordered"
        onChange={onChange}
        value={value}
      >
        <option disabled value={""}>
          {placeholder}
        </option>
        <option value={"None"}>None</option>
        <option value={"Minimal Transaction"}>Minimal Transaction</option>
        <option value={"Particular Product"}>Particular Product</option>
        <option value={"Particular Category"}>Particular Category</option>
      </select>
      <div className="label">
        <span className="label-text-alt text-error">
          {validation ? validation.message : ""}
        </span>
      </div>
    </label>
  );
};

export default ConditionsSelect;
