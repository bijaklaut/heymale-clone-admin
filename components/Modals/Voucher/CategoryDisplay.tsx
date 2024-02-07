import { CategoryTypes } from "../../../services/types";
import { MouseEventHandler } from "react";
import { CrossSvg } from "../../Misc/SvgGroup";

interface ThisProps {
  key: number | string;
  category: CategoryTypes;
  deselect: MouseEventHandler<HTMLButtonElement>;
}

const CategoryDisplay = ({ key, category, deselect }: ThisProps) => {
  return (
    <div
      key={key}
      className="relative flex w-full items-center justify-center gap-x-3 rounded-md bg-white px-3 py-2 shadow-lg"
    >
      <span className="text-sm text-neutral">{category.name}</span>
      <button
        className="absolute right-1 rounded-md text-neutral/50 transition-all hover:bg-slate-300/50 hover:text-neutral/70"
        onClick={deselect}
      >
        <CrossSvg className="w-7 fill-current" />
      </button>
    </div>
  );
};

export default CategoryDisplay;
