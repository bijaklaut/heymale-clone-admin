import { ChangeEvent } from "react";
import { PostAddressTypes } from "../../services/types";

interface TextInputProps {
  data: PostAddressTypes;
  label: string[];
  onChange(event: ChangeEvent, label: string): void;
  validation: { field: string; message: string }[];
}

const TextInput = (props: TextInputProps) => {
  const { label, onChange, validation, data } = props;
  const [textLabel, fieldLabel, placeholder] = label;

  return (
    <label className="w-full max-w-xs">
      <div className="label">
        <span className="label-text -ms-1 text-white">{textLabel}</span>
      </div>
      <input
        type="text"
        placeholder={placeholder ? placeholder : "Type here"}
        className="input h-10 w-full rounded-md border-2 border-gray-700 p-2 text-sm focus:outline-0 focus:ring-0"
        onChange={(e) => onChange(e, fieldLabel)}
        value={(data as any)[fieldLabel]}
      />
      <div className="label">
        {validation.map((val, i) =>
          val.field == fieldLabel ? (
            <span key={i} className="label-text-alt text-red-600">
              {val.message}
            </span>
          ) : (
            ""
          ),
        )}
      </div>
    </label>
  );
};

export default TextInput;
