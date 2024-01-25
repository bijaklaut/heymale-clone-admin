import { InputHTMLAttributes } from "react";
import { ArrowDownSvg } from "./SvgGroup";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
}

export const ProductExpand = ({ checked, onChange }: ThisProps) => {
  return (
    <div className="form-control xl:hidden">
      <label className="label cursor-pointer p-0">
        <input
          type="checkbox"
          checked={checked}
          className="peer checkbox hidden"
          onChange={onChange}
        />
        <ArrowDownSvg className="label-text fill-gray-500 transition-all peer-checked:rotate-180" />
      </label>
    </div>
  );
};
