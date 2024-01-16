import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import cx from "classnames";
import { ValidationTypes } from "../../services/types";
import { textInputHandler } from "../../services/helper";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  validations: ValidationTypes[];
}

const TextInput = (props: TextInputProps) => {
  const {
    dataState: { data, setData },
    label: [textLabel, fieldLabel, placeholder],
    type = "text",
    validations,
  } = props;
  const validation = validations.find((val) => val.field == fieldLabel);
  const inputClass = cx({
    "input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all":
      true,
    "input-error": validation,
  });

  return (
    <label data-theme={"skies"} className="w-full transition-all">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <input
        type={type}
        placeholder={placeholder || "Enter value"}
        className={inputClass}
        autoComplete="off"
        onChange={(e) => textInputHandler(e.target.value, fieldLabel, setData)}
        value={(data as any)[fieldLabel]}
      />
      <div className="label">
        <span className="label-text-alt text-error">
          {validation?.message || ""}
        </span>
      </div>
    </label>
  );
};

export default TextInput;
