import React, { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { ValidationTypes } from "../../services/types";
import { textInputHandler } from "../../services/helper";
import cx from "classnames";

interface TextAreaProps extends InputHTMLAttributes<HTMLInputElement> {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  validations: ValidationTypes[];
}

const TextAreaInput = (props: TextAreaProps) => {
  const {
    label,
    onKeyUp,
    validations,
    dataState: { data, setData },
  } = props;
  const [textLabel, fieldLabel, placeholder] = label;
  const validation = validations.find((val) => val.field == fieldLabel);
  const inputClass = cx({
    "textarea textarea-bordered min-h-[12rem] p-2 transition-color": true,
    "textarea-error": validation,
  });
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <textarea
        className={inputClass}
        placeholder={placeholder}
        onChange={(e) => textInputHandler(e.target.value, fieldLabel, setData)}
        value={(data as any)[fieldLabel]}
      ></textarea>
      <div className="label">
        <span className="label-text-alt text-error">
          {validation ? validation.message : ""}
        </span>
      </div>
    </label>
  );
};

export default TextAreaInput;
