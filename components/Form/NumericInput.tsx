import React, { Dispatch, SetStateAction } from "react";
import { NumericFormat } from "react-number-format";
import { numInputHandler } from "../../services/helper";
import { ValidationTypes } from "../../services/types";
import cx from "classnames";

interface NumInputProps {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  validations: ValidationTypes[];
  isCurrency?: boolean;
}

const NumericInput = (props: NumInputProps) => {
  const {
    dataState: { data, setData },
    label: [textLabel, fieldLabel, placeholder],
    validations,
    isCurrency = false,
  } = props;
  const validation = validations.find((val) => val.field == fieldLabel);
  const inputClass = cx({
    "input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all":
      true,
    "input-error": validation,
  });

  return (
    <label className="w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <NumericFormat
        allowNegative={false}
        valueIsNumericString
        thousandSeparator="."
        decimalSeparator=","
        prefix={isCurrency ? "Rp. " : ""}
        value={(data as any)[fieldLabel] || 0}
        onValueChange={(e) => numInputHandler(e.value, "price", setData)}
        className={inputClass}
        placeholder={placeholder || "Enter value"}
      />
      <div className="label">
        <span className="label-text-alt text-error">
          {validation?.message || ""}
        </span>
      </div>
    </label>
  );
};

export default NumericInput;
