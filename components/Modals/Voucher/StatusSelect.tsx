import { InputHTMLAttributes } from "react";
import { ValidationTypes } from "../../../services/types";

interface ThisProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string[];
  validations: ValidationTypes[];
}

const StatusSelect = ({ label, onChange, validations, value }: ThisProps) => {
  const [textLabel, fieldLabel, placeholder] = label;
  const validation = validations.filter((val) => val.field == fieldLabel)[0];
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
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
        <option value={"Active"}>Active</option>
        <option value={"Inactive"}>Inactive</option>
      </select>
      <div className="label">
        <span className="label-text-alt text-error">
          {validation ? validation.message : ""}
        </span>
      </div>
    </label>
  );
};

export default StatusSelect;
