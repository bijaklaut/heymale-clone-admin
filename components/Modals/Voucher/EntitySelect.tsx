import {
  ChangeEventHandler,
  Fragment,
  InputHTMLAttributes,
  MouseEventHandler,
  useCallback,
  useEffect,
} from "react";
import {
  CategoryTypes,
  PostVoucherTypes,
  ProductTypes,
  ValidationTypes,
} from "../../../services/types";
import ProductOption from "./ProductOption";
import ProductDisplay from "./ProductDisplay";
import CategoryDisplay from "./CategoryDisplay";
import CategoryOption from "./CategoryOption";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  data: PostVoucherTypes;
  filteredEntity: ProductTypes[] | CategoryTypes[];
  entities: ProductTypes[] | CategoryTypes[];
  searchLabel: string[];
  selectAll: MouseEventHandler<HTMLButtonElement>;
  deselectAll: MouseEventHandler<HTMLButtonElement>;
  deselect(productId: string, fieldLabel: string): void;
  selectHandler: ChangeEventHandler<HTMLInputElement>;
  searchHandler: ChangeEventHandler<HTMLInputElement>;
  validations: ValidationTypes[];
}

const interfaceCheck = (entity: any): entity is ProductTypes[] => {
  if (entity[0] === undefined) return false;
  return "thumbnail" in entity[0];
};

const EntitySelect = ({
  data,
  filteredEntity,
  entities,
  searchLabel,
  selectAll,
  deselectAll,
  deselect,
  selectHandler,
  searchHandler,
  validations,
}: ThisProps) => {
  const [textSearchLabel, placeholderSearch] = searchLabel;
  const validation = validations.filter((val) => {
    if (interfaceCheck(entities)) {
      return val.field.includes("validProducts");
    }

    return val.field.includes("validCategories");
  })[0];

  const deselectAllCond = useCallback(() => {
    if (interfaceCheck(entities)) {
      return data.validProducts.length == 0;
    }

    return data.validCategories.length == 0;
  }, [data, entities]);

  const selectAllCond = useCallback(() => {
    if (interfaceCheck(entities)) {
      return data.validProducts.length == entities.length;
    }

    return data.validCategories.length == entities.length;
  }, [data, entities]);

  const checkedSelect = useCallback(() => {
    entities.map((entity) => {
      const label = document.getElementById(entity._id)?.children[0];
      const input = label?.children[0] as HTMLInputElement;

      input.checked = false;
      label?.classList.remove("bg-primary/80");
    });

    if (data.conditions == "Particular Product") {
      (entities as ProductTypes[]).map((entity) => {
        const label = document.getElementById(entity._id)?.children[0];
        const input = label?.children[0] as HTMLInputElement;

        if (data.validProducts.includes(entity._id)) {
          input.checked = true;
          label?.classList.add("bg-primary/80");
        } else {
          input.checked = false;
          label?.classList.remove("bg-primary/80");
        }
      });
    }

    if (data.conditions == "Particular Category") {
      (entities as CategoryTypes[]).map((entity) => {
        const label = document.getElementById(entity._id)?.children[0];
        const input = label?.children[0] as HTMLInputElement;

        if (data.validProducts.includes(entity._id)) {
          input.checked = true;
          label?.classList.add("bg-primary/80");
        } else {
          input.checked = false;
          label?.classList.remove("bg-primary/80");
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (
      data.conditions == "Particular Product" ||
      data.conditions == "Particular Category"
    ) {
      checkedSelect();
    }
  }, [data]);

  return (
    <Fragment>
      {/* Dropdown Select & Search */}
      <div className="dropdown dropdown-top form-control mx-auto w-full">
        <label
          data-theme={"skies"}
          className="mx-auto w-full max-w-[500px] transition-all"
        >
          <div className="label sm:text-center">
            <span className="label-text -ms-1 w-full text-base text-white">
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
          />
          <div className="label">
            <span className="label-text-alt text-error">
              {validation ? validation.message : ""}
            </span>
          </div>
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
            : filteredEntity.map((entity, index) => {
                return (
                  <CategoryOption
                    key={index}
                    category={entity}
                    selectHandler={selectHandler}
                  />
                );
              })}
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
      {interfaceCheck(entities)
        ? data.validProducts.length > 0 && (
            <div className="mt-5 flex flex-col">
              <span className="mb-3">{`Selected Product (${data.validProducts.length})`}</span>
              <div className="mx-auto grid max-h-[500px] grid-cols-2 items-center gap-2 overflow-y-auto rounded-md px-2 max-sm:max-w-[400px] max-sm:grid-cols-1">
                {(entities as ProductTypes[])
                  .filter((product) => data.validProducts.includes(product._id))
                  .map((product, i) => {
                    return (
                      <ProductDisplay
                        key={i}
                        product={product}
                        deselect={() => deselect(product._id, "validProducts")}
                      />
                    );
                  })}
              </div>
            </div>
          )
        : data.validCategories.length > 0 && (
            <div className="mt-5 flex flex-col">
              <span className="mb-3">{`Selected Category (${data.validCategories.length})`}</span>
              <div className="mx-auto grid max-h-[500px] w-full grid-cols-2 items-center gap-2 overflow-y-auto rounded-md px-2 max-sm:max-w-[400px] max-[450px]:grid-cols-1 sm:grid-cols-3">
                {(entities as CategoryTypes[])
                  .filter((category) =>
                    data.validCategories.includes(category._id),
                  )
                  .map((category, i) => {
                    return (
                      <CategoryDisplay
                        key={i}
                        category={category}
                        deselect={() =>
                          deselect(category._id, "validCategories")
                        }
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
