import { ChangeEvent, InputHTMLAttributes } from "react";
import cx from "classnames";
import { ValidationTypes } from "../../services/types";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  data: any;
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  changeHandler?: (event: ChangeEvent, label: string) => void;
  validations: ValidationTypes[];
}

const TextInput = (props: TextInputProps) => {
  const { label, data, onKeyUp, validations, onChange } = props;
  const [textLabel, fieldLabel, placeholder] = label;
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
        type="text"
        placeholder={placeholder || "Type here"}
        className={inputClass}
        autoComplete="off"
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={(data as any)[fieldLabel]}
      />
      <div className="label">
        <span className="label-text-alt text-red-500">
          {validation ? validation.message : ""}
        </span>
      </div>
    </label>
  );
};

export default TextInput;
