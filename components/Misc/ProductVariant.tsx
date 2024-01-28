import { useCallback } from "react";
import { VariantTypes } from "../../services/types";
import cx from "classnames";

interface ThisProps {
  variants: VariantTypes;
}

export const ProductVariant = ({ variants }: ThisProps) => {
  const variantClass = useCallback(
    (k: string) => {
      return cx({
        "bg-transparent tooltip relative flex h-[25px] font-semibold w-[30px] items-center justify-center rounded-md border px-2 max-2xl:focus:tooltip-open":
          true,
        "text-green-500 border-green-500": (variants as any)[k] >= 100,
        "text-yellow-500 border-yellow-500":
          (variants as any)[k] < 100 && (variants as any)[k] >= 50,
        "text-red-500 border-red-500":
          (variants as any)[k] < 50 && (variants as any)[k] > 0,
        "text-gray-500 border-gray-400": (variants as any)[k] == 0,
      });
    },
    [variants],
  );
  return (
    <div className="flex gap-x-1 ">
      {Object.entries(variants).map(([k], id) => {
        return (
          <button
            key={id}
            className={variantClass(k)}
            data-tip={`${(variants as any)[k]} pcs`}
          >
            {k.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
