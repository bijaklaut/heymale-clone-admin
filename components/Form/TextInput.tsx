import { ChangeEvent } from "react";

interface TextInputProps {
  data: any;
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  onChange(event: ChangeEvent, label: string): void;
  validation?: { field: string; message: string }[];
}

const TextInput = (props: TextInputProps) => {
  const { label, onChange, validation, data } = props;
  const [textLabel, fieldLabel, placeholder] = label;

  return (
    <label data-theme={"skies"} className="w-full transition-all">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <input
        type="text"
        id={fieldLabel}
        placeholder={placeholder || "Type here"}
        className="input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all "
        autoComplete="off"
        onChange={(e) => onChange(e, fieldLabel)}
        value={(data as any)[fieldLabel]}
      />
      <div className="label">
        <span className="label-text-alt text-red-500"></span>
      </div>
    </label>
  );
};

export default TextInput;
