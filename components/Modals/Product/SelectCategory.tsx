import React, { ChangeEvent } from "react";
import { CategoryTypes, PostProductTypes } from "../../../services/types";
import { getCategories } from "../../../services/admin";

interface SelectCategoryProps {
  handler(event: ChangeEvent<HTMLSelectElement>): void;
  validation: {
    name: {
      message: string;
    };
    category: {
      message: string;
    };
    "variant.s": {
      message: string;
    };
    "variant.m": {
      message: string;
    };
    "variant.l": {
      message: string;
    };
    "variant.xl": {
      message: string;
    };
    price: {
      message: string;
    };
    description: {
      message: string;
    };
    thumbnail: {
      message: string;
    };
  };
  data: PostProductTypes;
  categories: CategoryTypes[];
}

const SelectCategory = (props: SelectCategoryProps) => {
  const { handler, validation, data, categories } = props;
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Product Category</span>
      </div>
      <select
        className="select select-bordered text-white"
        onChange={(e) => {
          handler(e);
        }}
        defaultValue={data.category ? data.category : ""}
      >
        <option disabled value={""}>
          Select Product Category
        </option>
        {categories.map((category: CategoryTypes, i: number) => {
          return (
            <option key={i} value={category._id}>
              {category.name}
            </option>
          );
        })}
      </select>
      <div className="label">
        {validation.category?.message ? (
          <span className="label-text-alt text-error">
            {validation.category?.message}
          </span>
        ) : (
          ""
        )}
      </div>
    </label>
  );
};

export default SelectCategory;
