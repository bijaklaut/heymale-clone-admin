import {
  ChangeEventHandler,
  Fragment,
  InputHTMLAttributes,
  useCallback,
  useEffect,
} from "react";
import {
  AreaDataTypes,
  PostAddressTypes,
  ValidationTypes,
} from "../../../services/types";
import { CircleCheckSvg } from "../../Misc/SvgGroup";
import cx from "classnames";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  data: PostAddressTypes;
  searchLabel: string[];
  searchLoading: boolean;
  areaData?: AreaDataTypes[];
  // deselect(productId: string, fieldLabel: string): void;
  selectHandler(areaId: string): void;
  searchHandler: ChangeEventHandler<HTMLInputElement>;
  validations: ValidationTypes[];
}

const AreaSelect = ({
  data,
  areaData,
  searchLabel,
  searchLoading,
  selectHandler,
  searchHandler,
  validations,
  value,
}: ThisProps) => {
  const [textSearchLabel, fieldLabel, placeholderSearch] = searchLabel;
  const validation = validations.filter((val) =>
    val.field.includes(fieldLabel),
  )[0];

  const loadingClass = useCallback(() => {
    return cx({
      "-translate-y-[1/2] loading loading-spinner loading-sm absolute right-3 top-[50%] transition-all":
        true,
      "scale-100": searchLoading,
      "scale-0": !searchLoading,
    });
  }, [searchLoading]);

  return (
    <Fragment>
      {/* Dropdown Select & Search */}
      <div className="dropdown dropdown-top form-control mx-auto w-full">
        <label
          data-theme={"skies"}
          className="relative mx-auto w-full max-w-[400px] transition-all"
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
            value={value}
          />
          <span className={loadingClass()}></span>
          <div className="label">
            <span className="label-text-alt text-error">
              {validation ? validation.message : ""}
            </span>
          </div>
        </label>
        {areaData?.length ? (
          <ul
            tabIndex={0}
            className="no-scrollbar dropdown-content z-[1] flex max-h-[300px] w-full flex-col gap-y-2 overflow-y-scroll rounded-md border border-slate-100 bg-base-100 p-2 shadow [&>li:hover]:bg-neutral/10"
          >
            {areaData.map((area, index) => {
              return (
                <li key={index} id={area.id}>
                  <label className="label w-full cursor-pointer rounded-md p-2 transition-all">
                    <input
                      type="radio"
                      className="peer hidden"
                      value={area.id}
                      onChange={() => selectHandler(area.id)}
                      checked={data.addressArea.areaId == area.id}
                    />
                    <div className="w-full">
                      <span>{area.name}</span>
                    </div>
                    <CircleCheckSvg className="w-7 scale-0 fill-current transition-all peer-checked:scale-100" />
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
      {data.addressArea.areaId && (
        <div className="mb-3 grid grid-cols-2 gap-x-5 gap-y-3">
          <label data-theme={"skies"} className="w-full transition-all">
            <div className="label">
              <span className="label-text -ms-1 text-base text-white">
                Province
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
              readOnly
              value={data.addressArea.province}
            />
          </label>
          <label data-theme={"skies"} className="w-full transition-all">
            <div className="label">
              <span className="label-text -ms-1 text-base text-white">
                City
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
              readOnly
              value={data.addressArea.city}
            />
          </label>
          <label data-theme={"skies"} className="w-full transition-all">
            <div className="label">
              <span className="label-text -ms-1 text-base text-white">
                District
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
              readOnly
              value={data.addressArea.district}
            />
          </label>
          <label data-theme={"skies"} className="w-full transition-all">
            <div className="label">
              <span className="label-text -ms-1 text-base text-white">
                Postal Code
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered input-sm w-full rounded-md py-5 text-lg transition-all"
              readOnly
              value={data.addressArea.postalCode}
            />
          </label>
        </div>
      )}
    </Fragment>
  );
};

export default AreaSelect;
