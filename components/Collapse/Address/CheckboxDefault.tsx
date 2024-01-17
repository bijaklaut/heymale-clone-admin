import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  data: any;
  isDefault: boolean;
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
}

const Checkbox = ({
  data,
  isDefault,
  label: [textLabel, fieldLabel],
  onChange,
}: CheckboxProps) => {
  return (
    <div className="form-control">
      <label className="label flex cursor-pointer justify-start gap-x-5">
        {isDefault ? (
          <input
            type="checkbox"
            checked
            disabled
            className="checkbox checkbox-sm"
          />
        ) : (
          <input
            type="checkbox"
            checked={(data as any)[fieldLabel] || false}
            onChange={onChange}
            className="checkbox-accent checkbox checkbox-sm"
          />
        )}
        <span className="label-text ms-0">{textLabel}</span>
      </label>
    </div>
  );
};

export default Checkbox;
