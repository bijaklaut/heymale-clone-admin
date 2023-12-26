import { ChangeEvent } from "react";
import { PostProductTypes } from "../../../services/types";

interface VariantInputProps {
  handler(event: ChangeEvent, label: string): void;
  label: string;
  validation: {
    name: {
      message: string;
    };
    category: {
      message: string;
    };
    "variant.s": {
      message: string;
    };
    "variant.m": {
      message: string;
    };
    "variant.l": {
      message: string;
    };
    "variant.xl": {
      message: string;
    };
    price: {
      message: string;
    };
    description: {
      message: string;
    };
    thumbnail: {
      message: string;
    };
  };
  data: PostProductTypes;
}

const VariantInput = (props: VariantInputProps) => {
  const { handler, label, validation, data } = props;
  const joinLabel = `variant.${label}`;

  return (
    <div className="join relative mb-10 w-36">
      <div className="label join-item bg-neutral ">
        <span className="label-text w-7 text-center font-bold text-white">
          {label.toUpperCase()}
        </span>
      </div>
      <input
        type="number"
        min={0}
        placeholder="Stock"
        className="input join-horizontal h-10 w-full rounded-l-none border-2 border-gray-700 p-2 text-white focus:outline-0 focus:ring-0"
        onChange={(e) => {
          handler(e, label);
        }}
        value={(data.variant as any)[label]}
      />
      <div className="label absolute -bottom-10 left-0">
        {(validation as any)[joinLabel]?.message ? (
          <span className="label-text-alt text-error">
            {(validation as any)[joinLabel]?.message}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default VariantInput;
