"use client";

import {
  CategoryFilterTypes,
  CategoryTypes,
  ProductTypes,
} from "../../services/types";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import UpdateProductModal from "../Modals/Product/UpdateProduct";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/admin";
import { NoDisplaySvg } from "../Misc/SvgGroup";

interface ProductTableProps {
  categories: CategoryTypes[];
}

interface ProductStatus {
  activeProducts: ProductTypes[];
  inactiveProducts: ProductTypes[];
}

const initialCriteria = (categories: CategoryTypes[]) => {
  let returnValue: CategoryFilterTypes[] = [];

  categories.map((category, i) => {
    return returnValue.push({ name: category.name, include: true });
  });

  return returnValue;
};

const ProductTable = (props: ProductTableProps) => {
  const { categories } = props;
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [filters, setFilters] = useState(initialCriteria(categories));
  const [search, setSearch] = useState("");
  const IMG_API = process.env.NEXT_PUBLIC_IMG;

  useEffect(() => {
    let joinArray: string[] = [];
    filters
      .filter((crit) => crit.include)
      .map((crit) => joinArray.push(crit.name));

    const query = `((^)(${joinArray.join("|")}))+$`;

    const getFiltered = async (data: { query: string; search: string }) => {
      const { payload } = await getProducts(data);
      return setProducts(payload);
    };

    getFiltered({ query, search });
  }, [filters, search]);

  return (
    <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
      <div className="mb-3 flex gap-x-3">
        <input
          type="text"
          placeholder="Search product by name"
          value={search}
          className="input input-bordered h-10 w-full max-w-xs transition-all focus:border-white focus:outline-none focus:ring-0"
          onChange={(e) => setSearch(e.target.value)}
        />
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
                        copyFilter.map((copy) =>
                          copy.name == fil.name
                            ? (copy.include = !copy.include)
                            : "",
                        );

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
      {products.length > 0 ? (
        <table data-theme={"nord"} className="table w-fit rounded-md">
          <thead>
            <tr>
              <th className="text-center text-base font-semibold">#</th>
              <th className="text-center text-base font-semibold">Product</th>
              <th className="text-center text-base font-semibold">Category</th>
              <th className="text-center text-base font-semibold">Variant</th>
              <th className="text-center text-base font-semibold">Price</th>
              <th className="w-[300px] text-center text-base font-semibold">
                Description
              </th>
              <th className="text-center text-base font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {products!.map((product: ProductTypes, i: any) => {
              return (
                <tr key={i} className="">
                  <th className="text-center">{i + 1}</th>
                  <td>
                    <div className="mb-3 flex min-h-[150px] w-full flex-col items-center justify-center gap-2">
                      <span className="font-semibold">{product.name}</span>
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
                  <td className="text-center">{product.category.name}</td>
                  <td>Variant</td>
                  <td className="w-[150px] text-center">
                    <NumericFormat
                      value={product.price}
                      displayType="text"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </td>
                  <td className="text-justify">
                    {product.description} Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Tempora itaque aspernatur, explicabo ipsum
                    soluta iusto fuga iste omnis dignissimos nihil officiis
                    commodi magni, architecto voluptate nulla fugit in impedit
                    nemo?
                  </td>

                  <td>
                    <div className="flex min-h-full items-center justify-center gap-x-2 px-5">
                      <UpdateProductModal
                        product={product}
                        categories={categories}
                        index={i}
                      />
                      <DeleteProductModal product={product} index={i} />
                    </div>
                  </td>
                </tr>
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

      {/* <div
            data-theme="nord"
            key={i}
            className="collapse collapse-arrow bg-base-200"
          >
            <input
              type="radio"
              name="my-accordion-2"
              checked={i == che ? true : false}
              onClick={() => (i)}
            />
            <div className="collapse-title flex gap-x-2 text-xl font-medium">
              <span className="text-gray-500">{`#${i + 1}`}</span>
              <span>{product.name}</span>
            </div>
            <div className="collapse-content flex">
              <div className="h-[300px] w-[200px] rounded-lg bg-primary"></div>
              <div className="description-group flex flex-col gap-y-3 px-4 py-2">
                <div className="description-item">
                  <span className="mr-3 font-bold">Category:</span>
                  <span>{product.category.name}</span>
                </div>
                <div className="description-item">
                  <span className="mr-3 font-bold">Price:</span>
                  <span>{product.price}</span>
                </div>
                <div className="description-item">
                  <span className="font-bold">Variant: </span>
                  <table className="table mt-3 bg-secondary">
                    <thead>
                      <tr className=" text-center text-white">
                        <th className="border-b-2 p-3">S</th>
                        <th className="border-b-2 p-3 ">M</th>
                        <th className="border-b-2 p-3 ">L</th>
                        <th className="border-b-2 p-3 ">XL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-3">{product.variant.s}</td>
                        <td className="border-l-2 p-3">{product.variant.m}</td>
                        <td className="border-l-2 p-3">{product.variant.l}</td>
                        <td className="border-l-2 p-3">{product.variant.xl}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                </div>
                <div className="description-item mt-3">
                  <span>Description:</span>
                  <span>{product.description}</span>
                </div>
              </div>
            </div>
          </div> */}
    </div>
  );
};

export default ProductTable;
