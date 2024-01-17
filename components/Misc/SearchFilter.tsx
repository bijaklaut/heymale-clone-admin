import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { FilterTypes } from "../../services/types";
import { changeFilter } from "../../services/helper";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  search: string;
  filterData?: {
    filters?: FilterTypes[];
    setFilters?: Dispatch<SetStateAction<FilterTypes[]>>;
  };
  placeholder?: string;
}

const SearchFilter = ({
  filterData,
  onChange,
  placeholder,
  search,
}: ThisProps) => {
  return (
    <div className="flex items-center gap-x-3">
      <input
        type="text"
        placeholder={placeholder || "Search table"}
        value={search}
        className="input input-bordered h-9 w-full max-w-xs transition-all focus:border-white focus:outline-none focus:ring-0"
        onChange={onChange}
      />
      {filterData ? (
        <div
          data-theme={"nord"}
          className="dropdown dropdown-right bg-transparent"
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline btn-accent btn-sm m-1 rounded-md px-5 text-white"
          >
            Filter
          </div>
          <div
            tabIndex={0}
            className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {filterData.filters?.map((fil, i) => {
              const { filters, setFilters } = filterData;

              return (
                <div key={i} className="form-control">
                  <label className="label cursor-pointer justify-normal gap-x-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={fil.include}
                      onChange={() => {
                        changeFilter(filters!, fil, setFilters!);
                      }}
                    />
                    <span className="label-text">{fil.name}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchFilter;
