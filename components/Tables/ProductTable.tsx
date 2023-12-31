"use client";

import { CategoryTypes, ProductTypes } from "../../services/types";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import UpdateProductModal from "../Modals/Product/UpdateProduct";

interface ProductTableProps {
  products: {
    activeProducts: ProductTypes[];
    inactiveProducts: ProductTypes[];
  };
  categories: CategoryTypes[];
}

const ProductTable = (props: ProductTableProps) => {
  const { products, categories } = props;
  const IMG_API = process.env.NEXT_PUBLIC_IMG;

  return (
    <div className="mt-3 flex max-w-4xl flex-col gap-3 overflow-x-auto py-3">
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
          {products.activeProducts.map((product: ProductTypes, i: any) => {
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
