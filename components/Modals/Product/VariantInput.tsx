import { ChangeEvent } from "react";

interface VariantInputProps {
  data: any;
  handler(event: ChangeEvent, label: string): void;
  label: string;
  validation: { field: string; message: string }[];
}

const VariantInput = (props: VariantInputProps) => {
  const { handler, label, validation, data } = props;
  const joinLabel = `variant.${label}`;

  return (
    <div className="join relative w-36 md:w-1/5">
      <div className="label join-item bg-gray-800">
        <span className="label-text w-7 text-center font-bold text-white">
          {label.toUpperCase()}
        </span>
      </div>
      <input
        type="number"
        min={0}
        className="input join-horizontal h-10 w-full rounded-l-none border-2 border-white p-2 text-neutral focus:outline-0 focus:ring-0"
        onChange={(e) => {
          handler(e, label);
        }}
        value={(data.variant as any)[label]}
      />
      <div className="label absolute -bottom-10 left-0">
        {validation.map((val, i) =>
          val.field == joinLabel ? (
            <span key={i} className="label-text-alt text-error">
              {val.message}
            </span>
          ) : (
            ""
          ),
        )}
      </div>
    </div>
  );
};

export default VariantInput;
