import Image from "next/image";
import { CrossSvg } from "../../Misc/SvgGroup";
import { productImageUrl } from "../../../services/helper";
import {
  ChangeEvent,
  ChangeEventHandler,
  Fragment,
  InputHTMLAttributes,
  MouseEventHandler,
  useCallback,
} from "react";
import {
  CategoryTypes,
  PostVoucherTypes,
  ProductTypes,
  ValidationTypes,
} from "../../../services/types";
import ProductOption from "./ProductOption";
import ProductDisplay from "./ProductDisplay";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  data: PostVoucherTypes;
  filteredEntity: ProductTypes[] | CategoryTypes[];
  searchLabel: string[];
  selectAll: MouseEventHandler<HTMLButtonElement>;
  deselectAll: MouseEventHandler<HTMLButtonElement>;
  deselect(productId: string): void;
  selectHandler: ChangeEventHandler<HTMLInputElement>;
  searchHandler: ChangeEventHandler<HTMLInputElement>;
  validations: ValidationTypes[];
}

const interfaceCheck = (entity: any): entity is ProductTypes[] => {
  return "thumbnail" in entity[0];
};

const EntitySelect = ({
  data,
  filteredEntity,
  searchLabel,
  selectAll,
  deselectAll,
  deselect,
  selectHandler,
  searchHandler,
  validations,
}: ThisProps) => {
  const [textSearchLabel, placeholderSearch] = searchLabel;
  // const validation = validations.filter((val) => val.field == fieldLabel);

  const deselectAllCond = useCallback(() => {
    if (interfaceCheck(filteredEntity)) {
      return data.validProducts.length == 0;
    }

    return data.validCategories.length == 0;
  }, [data, filteredEntity]);

  const selectAllCond = useCallback(() => {
    if (interfaceCheck(filteredEntity)) {
      return data.validProducts.length == filteredEntity.length;
    }

    return data.validCategories.length == filteredEntity.length;
  }, [data, filteredEntity]);

  return (
    <Fragment>
      {/* Dropdown Select & Search */}
      <div className="dropdown dropdown-top form-control mx-auto w-full">
        <label data-theme={"skies"} className="w-full transition-all">
          <div className="label">
            <span className="label-text -ms-1 text-base text-white">
              {textSearchLabel}
            </span>
          </div>
          <input
            tabIndex={0}
            type={"text"}
            placeholder={placeholderSearch}
            className={
              "input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
            }
            onChange={searchHandler}
            onClick={() => console.log(interfaceCheck(filteredEntity))}
          />
        </label>
        <ul
          tabIndex={0}
          className="no-scrollbar dropdown-content z-[1] flex h-[300px] w-full flex-col gap-y-2 overflow-y-scroll rounded-box border bg-base-100 p-2 shadow [&>li:hover]:bg-neutral/10"
        >
          {interfaceCheck(filteredEntity)
            ? filteredEntity.map((entity, index) => {
                return (
                  <ProductOption
                    key={index}
                    product={entity}
                    selectHandler={selectHandler}
                  />
                );
              })
            : ""}
        </ul>
      </div>
      {/* Button */}
      <div className="mt-3 flex justify-center gap-x-2">
        <button
          className="btn btn-accent btn-sm flex text-white"
          disabled={selectAllCond()}
          onClick={selectAll}
        >
          Select All
        </button>
        <button
          className="btn btn-accent btn-sm flex text-white"
          disabled={deselectAllCond()}
          onClick={deselectAll}
        >
          Deselect All
        </button>
      </div>
      {data.validProducts.length > 0 && (
        <div className="flex flex-col">
          <span className="mb-3">{`Selected Product (${data.validProducts.length})`}</span>
          <div className="grid grid-cols-2 items-center gap-2">
            {(filteredEntity as ProductTypes[])
              .filter((product) => data.validProducts.includes(product._id))
              .map((product, i) => {
                return (
                  <ProductDisplay
                    key={i}
                    product={product}
                    deselect={() => deselect(product._id)}
                  />
                );
              })}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default EntitySelect;
