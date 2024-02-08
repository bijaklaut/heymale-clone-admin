import { ChangeEventHandler, InputHTMLAttributes } from "react";
import { CategoryTypes } from "../../../services/types";
import { CircleCheckSvg } from "../../Misc/SvgGroup";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  category: CategoryTypes;
  selectHandler: ChangeEventHandler<HTMLInputElement>;
}

const CategoryOption = ({ category, selectHandler }: ThisProps) => {
  return (
    <li id={category._id}>
      <label className="label w-full cursor-pointer rounded-md p-2 transition-all">
        <input
          type="checkbox"
          className="peer hidden"
          value={category._id}
          onChange={selectHandler}
        />
        <div className="w-full">
          <span>{category.name}</span>
        </div>
        <CircleCheckSvg className="w-7 scale-0 fill-current transition-all peer-checked:scale-100" />
      </label>
    </li>
  );
};

export default CategoryOption;
