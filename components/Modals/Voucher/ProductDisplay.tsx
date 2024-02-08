import Image from "next/image";
import { ProductTypes } from "../../../services/types";
import { productImageUrl } from "../../../services/helper";
import { MouseEventHandler } from "react";
import { CrossSvg } from "../../Misc/SvgGroup";

interface ThisProps {
  product: ProductTypes;
  deselect: MouseEventHandler<HTMLButtonElement>;
}

const ProductDisplay = ({ product, deselect }: ThisProps) => {
  return (
    <div className="relative flex items-center gap-x-3 rounded-md bg-white px-3 py-2 shadow-lg">
      <Image
        src={productImageUrl(product.thumbnail)}
        height={500}
        width={500}
        alt="image"
        className="h-auto w-[75px] rounded-md"
      />
      <div className="flex flex-col">
        <span className="text-sm text-neutral">{product.name}</span>
        <span className="text-sm text-neutral/50">{product.category.name}</span>
      </div>
      <button
        className="absolute right-1 top-1 rounded-md text-neutral/50 transition-all hover:bg-slate-300/50 hover:text-neutral/70 focus:bg-slate-300/50 focus:text-neutral/70"
        onClick={deselect}
      >
        <CrossSvg className="w-7 fill-current" />
      </button>
    </div>
  );
};

export default ProductDisplay;
