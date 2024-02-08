import { ChangeEvent, ChangeEventHandler, InputHTMLAttributes } from "react";
import { ProductTypes } from "../../../services/types";
import Image from "next/image";
import { productImageUrl } from "../../../services/helper";
import { CircleCheckSvg } from "../../Misc/SvgGroup";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  product: ProductTypes;
  selectHandler: ChangeEventHandler<HTMLInputElement>;
}

const ProductOption = ({ product, selectHandler }: ThisProps) => {
  return (
    <li id={product._id}>
      <label className="label w-full cursor-pointer rounded-md p-2 transition-all">
        <input
          type="checkbox"
          className="peer hidden"
          value={product._id}
          onChange={selectHandler}
        />
        <div className="flex w-full items-center gap-x-3">
          <Image
            src={productImageUrl(product.thumbnail)}
            height={500}
            width={500}
            alt="image"
            className="h-auto w-[75px] rounded-md"
          />
          <div className="flex flex-col">
            <span>{product.name}</span>
            <span className="text-sm text-white/50">
              {product.category.name}
            </span>
          </div>
        </div>
        <CircleCheckSvg className="w-7 scale-0 fill-current transition-all peer-checked:scale-100" />
      </label>
    </li>
  );
};

export default ProductOption;
