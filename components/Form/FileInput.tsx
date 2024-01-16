import {
  Dispatch,
  InputHTMLAttributes,
  RefObject,
  SetStateAction,
  forwardRef,
} from "react";
import { ValidationTypes } from "../../services/types";
import cx from "classnames";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fileSetState: {
    setPreview: Dispatch<SetStateAction<string>>;
    setData: Dispatch<SetStateAction<any>>;
  };
  label: [textLabel: string, fieldLabel: string, placeholder?: string];
  validations: ValidationTypes[];
  ref: RefObject<HTMLInputElement>;
}

export type Ref = HTMLInputElement;

const FileInput = forwardRef<Ref, FileInputProps>(function Component(
  {
    fileSetState: { setPreview, setData },
    label: [textLabel, fieldLabel],
    validations,
  }: FileInputProps,
  ref,
) {
  const validation = validations.find((val) => val.field == fieldLabel);
  const inputClass = cx({
    "file-input file-input-bordered file-input-sm w-full transition-all": true,
    "file-input-error": validation,
  });

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          {textLabel}
        </span>
      </div>
      <input
        type="file"
        ref={ref}
        className={inputClass}
        accept="image/jpg, image/jpeg, image/png"
        onChange={(e) => {
          if (e.target.files instanceof FileList) {
            setPreview(URL.createObjectURL(e.target.files[0]));
            setData((prev: any) => ({
              ...prev,
              [fieldLabel]: e.target.files![0],
            }));
          }
        }}
      />
      <div className="label">
        <span className="label-text-alt text-error">
          {validation?.message || ""}
        </span>
      </div>
    </label>
  );
});

export default FileInput;
