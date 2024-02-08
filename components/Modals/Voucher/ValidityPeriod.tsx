import { InputHTMLAttributes, useCallback, useEffect } from "react";
import { ValidationTypes } from "../../../services/types";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string[];
  validations: ValidationTypes[];
}

const ValidityPeriod = ({ label, onChange, validations, value }: ThisProps) => {
  const [textLabel, fieldLabel] = label;
  const validation = validations.filter((val) => val.field == fieldLabel)[0];

  const todayDate = useCallback(
    () => new Date().toISOString().split("T")[0],
    [],
  );

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <input
        type="date"
        className="input input-bordered input-sm box-content rounded-md bg-transparent px-2 py-1 uppercase transition-all focus:outline-none focus:ring-0"
        onChange={onChange}
        value={value}
        min={todayDate()}
      />
      <div className="label">
        <span className="label-text-alt text-error">
          {validation ? validation.message : ""}
        </span>
      </div>
    </label>
  );
};

export default ValidityPeriod;
