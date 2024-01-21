import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { NumericFormat } from "react-number-format";
import { variantHandler } from "../../../services/helper";

interface VariantInputProps extends InputHTMLAttributes<HTMLInputElement> {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: string;
  validations: { field: string; message: string }[];
}

const VariantInput = (props: VariantInputProps) => {
  const {
    label,
    validations,
    dataState: { data, setData },
  } = props;
  const joinLabel = `variant.${label}`;
  const validation = validations.find((val) => val.field == joinLabel);

  return (
    <div className="join relative w-full">
      <div className="label join-item bg-neutral">
        <span className="label-text w-7 text-center font-bold text-white">
          {label.toUpperCase()}
        </span>
      </div>
      <NumericFormat
        allowNegative={false}
        valueIsNumericString
        thousandSeparator="."
        decimalSeparator=","
        value={(data.variant as any)[label] || 0}
        onValueChange={(e) => variantHandler(e.value, label, setData)}
        className="input input-bordered join-horizontal h-10 w-full rounded-l-none p-2"
        placeholder="Enter stock"
      />
      <div className="label absolute -bottom-10 left-0">
        <span className="label-text-alt text-error">
          {validation?.message || ""}
        </span>
      </div>
    </div>
  );
};

export default VariantInput;
