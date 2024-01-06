"use client";

import {
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useState,
} from "react";
import {
  CategoryFilterTypes,
  CategoryTypes,
  ProductTypes,
} from "../../services/types";
import { getProducts } from "../../services/admin";
import ProductTable from "./ProductTable";
import { NoDisplaySvg } from "../Misc/SvgGroup";
import UpdateProductModal from "../Modals/Product/UpdateProduct";
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import NumFormatWrapper from "../Misc/NumFormatWrapper";
import cx from "classnames";
import Image from "next/image";
import CreateProductModal from "../Modals/Product/CreateProduct";

interface ThisProps {
  categories: CategoryTypes[];
}

const initialCriteria = (categories: CategoryTypes[]) => {
  let returnValue: CategoryFilterTypes[] = [];

  categories.map((category) => {
    return returnValue.push({ name: category.name, include: true });
  });

  return returnValue;
};

const ProductTableWrapper = (props: ThisProps) => {
  const { categories } = props;
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [filters, setFilters] = useState(initialCriteria(categories || []));
  const [search, setSearch] = useState("");
  const [changes, setChanges] = useState(false);
  const IMG_API = process.env.NEXT_PUBLIC_IMG;

  const stateChanges = () => setChanges((prev) => !prev);

  useEffect(() => {
    let joinArray: string[] = [];
    filters
      .filter((crit) => crit.include)
      .map((crit) => joinArray.push(crit.name));

    const query = `((^)(${joinArray.join("|")}))+$` || "";

    const getFiltered = async (data: { query: string; search: string }) => {
      const { payload } = await getProducts(data);
      return setProducts(payload);
    };

    getFiltered({ query, search });
  }, [filters, search, changes]);

  return (
    <>
      <CreateProductModal categories={categories} stateChanges={stateChanges} />

      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <div className="mb-3 flex gap-x-3">
          <input
            type="text"
            placeholder="Search product by name"
            value={search}
            className="input input-bordered h-10 w-full max-w-xs transition-all focus:border-white focus:outline-none focus:ring-0"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setChanges((prev) => !prev)}
          >
            Changes
          </button>
          <div
            data-theme={"nord"}
            className="dropdown dropdown-right bg-transparent"
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-secondary btn-sm m-1 rounded-md px-3 text-white"
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
                          let copyFilter = [...filters];
                          copyFilter.map((copy) => {
                            if (copy.name == fil.name)
                              return (copy.include = !copy.include);
                          });

                          setFilters(copyFilter);
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
        {products?.length ? (
          <table data-theme={"nord"} className="table w-fit rounded-md">
            <thead>
              <tr>
                <th className="text-center text-base font-semibold">#</th>
                <th className="text-center text-base font-semibold">Product</th>
                <th className="text-center text-base font-semibold">Stock</th>
                <th className="text-center text-base font-semibold">Price</th>
                <th className="text-center text-base font-semibold">Status</th>
                <th className="w-[300px] text-center text-base font-semibold">
                  Description
                </th>
                <th className="text-center text-base font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {filters?.map((fil, index) => {
                let isExist = products.filter(
                  (product) => product.category.name == fil.name,
                ).length;
                if (fil.include && isExist)
                  return (
                    <>
                      <tr key={index} className="bg-gray-300">
                        <td colSpan={7} className="text-center font-semibold">
                          {fil.name}
                        </td>
                      </tr>
                      {products.map((product: ProductTypes, i) => {
                        let statusClass = cx({
                          "inline-block h-2 w-2 rounded-full": true,
                          "bg-green-400": product.status == "Active",
                          "bg-red-400": product.status == "Inactive",
                        });

                        if (product.category.name == fil.name)
                          return (
                            <tr key={i} className="">
                              <th className="text-center">{i + 1}</th>
                              <td>
                                <div className="mb-3 flex min-h-[150px] w-full flex-col items-center justify-center gap-2">
                                  <span className="font-semibold">
                                    {product.name}
                                  </span>
                                  <Image
                                    src={
                                      product.thumbnail != ""
                                        ? `${IMG_API}/product/${product.thumbnail}`
                                        : "icon/image.svg"
                                    }
                                    width={90}
                                    height={90}
                                    alt={`thumbnail-${product.name}`}
                                    className={
                                      product.thumbnail != ""
                                        ? "h-auto w-auto rounded-md border-2 border-neutral bg-cover"
                                        : "h-[90px] w-auto rounded-md bg-neutral p-2"
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex gap-x-2">
                                  {Object.entries(product.variant).map(
                                    ([k], id) => {
                                      let variantClass = cx({
                                        "tooltip relative flex h-[25px] font-semibold w-[30px] items-center justify-center rounded-md border px-2 cursor-default":
                                          true,
                                        "text-green-500 border-green-500":
                                          (product.variant as any)[k] >= 100,
                                        "text-yellow-500 border-yellow-500":
                                          (product.variant as any)[k] < 100 &&
                                          (product.variant as any)[k] >= 50,
                                        "text-red-500 border-red-500":
                                          (product.variant as any)[k] < 50 &&
                                          (product.variant as any)[k] > 0,
                                        "text-gray-500 border-gray-400":
                                          (product.variant as any)[k] == 0,
                                      });
                                      return (
                                        <div
                                          key={id}
                                          className={variantClass}
                                          data-tip={`${
                                            (product.variant as any)[k]
                                          } pcs`}
                                        >
                                          <p>{k.toUpperCase()}</p>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </td>
                              <td className="w-[150px] text-center">
                                <NumFormatWrapper
                                  value={product.price}
                                  displayType="text"
                                  prefix="Rp. "
                                  thousandSeparator="."
                                  decimalSeparator=","
                                />
                              </td>
                              <td className="text-center">
                                <div className="flex items-center gap-x-2">
                                  <span className={statusClass}></span>
                                  <p>{product.status}</p>
                                </div>
                              </td>
                              <td className="text-justify">
                                {product.description} Lorem ipsum dolor sit amet
                                consectetur adipisicing elit. Tempora itaque
                                aspernatur, explicabo ipsum soluta iusto fuga
                                iste omnis dignissimos nihil officiis commodi
                                magni, architecto voluptate nulla fugit in
                                impedit nemo?
                              </td>
                              <td>
                                <div className="flex min-h-full items-center justify-center gap-x-2 px-5">
                                  <UpdateProductModal
                                    product={product}
                                    categories={categories!}
                                    index={i}
                                    stateChanges={stateChanges}
                                  />
                                  <DeleteProductModal
                                    product={product}
                                    index={i}
                                    stateChanges={stateChanges}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                      })}
                    </>
                  );
              })}
            </tbody>
          </table>
        ) : (
          <div className="mx-auto mt-10 flex w-max flex-col items-center justify-center rounded-md bg-white px-16 py-10 text-neutral">
            <NoDisplaySvg className="h-10 w-10 stroke-current" />
            <p className="mt-3">{"There's no products to display"}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductTableWrapper;
