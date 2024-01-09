import { Fragment } from "react";
import { CategoryTypes, FilterTypes, ProductTypes } from "../../services/types";
import Image from "next/image";
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import UpdateProductModal from "../Modals/Product/UpdateProduct";
import cx from "classnames";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";

interface ProductTableProps {
  stateChanges(): void;
  pageHandler(page: number | null): void;
  categories: CategoryTypes[];
  filters: FilterTypes[];
  paginate: {
    docs: ProductTypes[];
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

const ProductTable = (props: ProductTableProps) => {
  const { categories, filters, stateChanges, paginate, pageHandler } = props;
  const { docs: products } = paginate;

  const IMG_API = process.env.NEXT_PUBLIC_IMG;

  return (
    <div className="max-w-5xl">
      {products?.length ? (
        <table data-theme={"nord"} className="table w-full rounded-md">
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
              if (fil.include && isExist) {
                return (
                  <Fragment key={index}>
                    <tr className="bg-gray-300">
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
                          <tr
                            key={`${product._id}-${paginate.pagingCounter + i}`}
                          >
                            <th className="text-center">
                              {paginate.pagingCounter + i}
                            </th>
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
                              aspernatur, explicabo ipsum soluta iusto fuga iste
                              omnis dignissimos nihil officiis commodi magni,
                              architecto voluptate nulla fugit in impedit nemo?
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
                  </Fragment>
                );
              }
            })}
          </tbody>
        </table>
      ) : (
        <NoDisplay text={"There's no products to display"} />
      )}
      <Pagination paginate={paginate} pageHandler={pageHandler} />
    </div>
  );
};

export default ProductTable;
{
  /* <div
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
          </div> */
}
