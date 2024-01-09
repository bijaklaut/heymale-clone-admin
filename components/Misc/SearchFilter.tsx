import { ChangeEvent } from "react";
import { FilterTypes } from "../../services/types";

interface ThisProps {
  data: {
    filters: FilterTypes[];
    search: string;
  };
  changeSearch(event: ChangeEvent<HTMLInputElement>): void;
  changeFilter(filters: FilterTypes[], filter: FilterTypes): void;
}

const SearchFilter = ({ data, changeSearch, changeFilter }: ThisProps) => {
  const { filters, search } = data;

  return (
    <div className="mb-3 flex items-center gap-x-3">
      <input
        type="text"
        placeholder="Search product by name"
        value={search}
        className="input input-bordered h-9 w-full max-w-xs transition-all focus:border-white focus:outline-none focus:ring-0"
        onChange={(e) => changeSearch(e)}
      />
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
          {filters.map((fil, i) => {
            return (
              <div key={i} className="form-control">
                <label className="label cursor-pointer justify-normal">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm me-4"
                    checked={fil.include}
                    onChange={() => {
                      changeFilter(filters, fil);
                    }}
                  />
                  <span className="label-text">{fil.name}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
