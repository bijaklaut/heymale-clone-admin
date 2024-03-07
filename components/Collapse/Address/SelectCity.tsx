import { InputHTMLAttributes } from "react";
import { PostAddressTypes, ValidationTypes } from "../../../services/types";

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement> {
  data: PostAddressTypes;
  citiesData: any[];
  validations: ValidationTypes[];
}

export const SelectCity = ({
  validations,
  data,
  citiesData,
  onChange,
}: SelectInputProps) => {
  const validation = validations.find((val) => val.field == "city._id");
  return (
    <label data-theme={"skies"} className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">City</span>
      </div>
      <select
        className="select select-bordered rounded-md"
        onChange={onChange}
        disabled={!data.addressArea.province}
        value={data.addressArea.city || ""}
      >
        <option disabled value={""}>
          Select City
        </option>
        {citiesData.map((item: any, i: number) => {
          return (
            <option key={i} value={item.city_id}>
              {item.city_name}
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

export default SelectCity;
