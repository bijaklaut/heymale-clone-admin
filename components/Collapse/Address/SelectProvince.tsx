import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { PostAddressTypes, ValidationTypes } from "../../../services/types";

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement> {
  data: PostAddressTypes;
  provincesData: any[];
  validations: ValidationTypes[];
}

export const SelectProvince = ({
  validations,
  data,
  provincesData,
  onChange,
}: SelectInputProps) => {
  const validation = validations.find((val) => val.field == "province._id");
  return (
    <label data-theme={"skies"} className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">Province</span>
      </div>
      <select
        className="select select-bordered rounded-md"
        onChange={onChange}
        value={data.addressArea.province || ""}
      >
        <option disabled value={""}>
          Select Province
        </option>
        {provincesData.map((item: any, i: number) => {
          return (
            <option key={i} value={item.province_id}>
              {item.province}
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

export default SelectProvince;
