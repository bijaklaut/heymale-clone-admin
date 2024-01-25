import {
  ChangeEvent,
  Fragment,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";
import {
  CategoryTypes,
  FilterTypes,
  PaginationTypes,
  ProductTypes,
} from "../../services/types";
import Image from "next/image";
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import UpdateProductModal from "../Modals/Product/UpdateProduct";
import cx from "classnames";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { ProductExpand } from "../Misc/ProductExpand";
import { ProductThumbnail } from "../Misc/ProductThumbnail";
import { ProductVariant } from "../Misc/ProductVariant";

interface ProductTableProps {
  stateChanges(): void;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
  categories: CategoryTypes[];
  filters: FilterTypes[];
  paginate: PaginationTypes;
}

const ProductTable = (props: ProductTableProps) => {
  const { categories, filters, stateChanges, paginate, paginateAction } = props;
  const { docs: products } = paginate;
  const [active, setActive] = useState(0);

  const parentRowClass = cx({
    "grid h-fit w-full grid-cols-5 items-center justify-items-stretch rounded-md bg-white px-3 py-3 text-neutral shadow-md md:grid-cols-8 lg:grid-cols-10 3xl:grid-cols-12":
      true,
  });
  const mainContentClass = cx({
    "col-span-3 grid w-full items-center gap-x-3 justify-self-center md:col-span-6 md:grid md:grid-cols-3 lg:col-span-8 lg:grid-cols-4 lg:gap-x-0 3xl:col-span-10 3xl:grid-cols-6":
      true,
  });
  const priceVariantClass = cx({
    "hidden flex-col items-start gap-y-2 justify-self-center md:flex lg:col-span-2 lg:grid lg:grid-cols-2 lg:justify-self-auto":
      true,
  });
  const collapseClass = useCallback((active: number, index: number) => {
    return cx({
      "group flex h-fit w-full origin-top flex-col justify-between gap-x-3 overflow-hidden rounded-md bg-white p-3 text-neutral shadow-md sm:px-5 md:h-full md:pt-8 lg:mx-auto lg:w-[80%] lg:px-16 lg:pt-3 2xl:w-[65%] 3xl:hidden":
        true,
      "relative scale-100 opacity-100": active == index,
      "absolute scale-0 opacity-0": active != index,
    });
  }, []);
  const statusClass = useCallback((status: string) => {
    return cx({
      "badge badge-outline px-5 font-semibold lg:justify-self-center": true,
      "badge-primary": status == "Active",
      "badge-error": status == "Inactive",
    });
  }, []);
  const expandHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>, index: number) => {
      const parent = event.target.parentElement;

      if (active == index) {
        setActive(-1);
      } else {
        setActive(index);
        setTimeout(() => {
          window.scrollTo({
            top: parent!.offsetTop - 85,
            behavior: "smooth",
          });
        }, 50);
      }
    },
    [active],
  );

  return (
    <div className="max-w-[1920px]">
      {products.length ? (
        <Fragment>
          {filters.map((fil, i) => {
            let isExist = (products as ProductTypes[]).filter(
              (product) => product.category.name == fil.name,
            ).length;

            if (fil.include && isExist) {
              return (
                <div key={i} className="mb-8">
                  <div
                    data-theme="skies"
                    className="mb-2 h-fit w-full rounded-md bg-base-300 py-1 text-center text-white"
                  >
                    {fil.name}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {(products as ProductTypes[]).map((product, index) => {
                      if (product.category.name == fil.name)
                        return (
                          <Fragment key={index}>
                            <div className={parentRowClass}>
                              {/* Number */}
                              <span className="me-1 justify-self-start font-semibold text-base-100/60 3xl:justify-self-center">
                                {paginate.pagingCounter + index}
                              </span>

                              {/* Main content */}
                              <div className={mainContentClass}>
                                {/* Thumbnail 3XL */}
                                <div className="hidden w-full justify-self-center 3xl:block">
                                  <ProductThumbnail
                                    thumbnail={product.thumbnail}
                                    width={500}
                                    height={500}
                                    alt={`thumbnail-${product.name}`}
                                  />
                                </div>

                                {/* Product Name */}
                                <div className="justify-self-center text-center font-semibold md:justify-self-start md:text-start">
                                  {product.name}
                                </div>

                                {/* Price & Variant MD */}
                                <div className={priceVariantClass}>
                                  <div className="flex flex-col items-start justify-self-center">
                                    <span className="font-semibold lg:hidden">
                                      Price
                                    </span>
                                    <NumFormatWrapper
                                      value={product.price}
                                      displayType="text"
                                      prefix="Rp. "
                                      thousandSeparator="."
                                      decimalSeparator=","
                                    />
                                  </div>
                                  <div className="flex flex-col items-start gap-y-2 justify-self-center">
                                    <span className="font-semibold lg:hidden">
                                      Variant
                                    </span>
                                    <ProductVariant
                                      variants={product.variant}
                                    />
                                  </div>
                                </div>

                                {/* Status MD */}
                                <div className="hidden md:block md:justify-self-center">
                                  <div
                                    data-theme="skies"
                                    className={statusClass(product.status)}
                                  >
                                    {product.status}
                                  </div>
                                </div>

                                {/* Description 3XL */}
                                <div className="hidden justify-self-center 3xl:block">
                                  <button className="btn btn-accent btn-sm text-white">
                                    Description
                                  </button>
                                </div>
                              </div>

                              {/* Expand or Action */}
                              <div className="justify-self-end 3xl:justify-self-center">
                                <div className="flex items-center justify-center gap-x-2 p-3">
                                  <div className="hidden gap-x-2 lg:flex">
                                    <UpdateProductModal
                                      product={product}
                                      categories={categories!}
                                      index={index}
                                      stateChanges={stateChanges}
                                    />
                                    <DeleteProductModal
                                      product={product}
                                      index={index}
                                      stateChanges={stateChanges}
                                    />
                                  </div>
                                  <ProductExpand
                                    checked={active == index}
                                    onChange={(e) => expandHandler(e, index)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={collapseClass(active, index)}>
                              <div className="flex items-center gap-x-3 md:mt-5 lg:mt-0 lg:gap-x-10">
                                <div className="flex w-[45%] md:justify-center">
                                  <ProductThumbnail
                                    thumbnail={product.thumbnail}
                                    width={500}
                                    height={500}
                                    alt={`thumbnail-${product.name}`}
                                  />
                                </div>
                                <div className="grid w-[55%] grid-cols-1 gap-y-2 md:hidden">
                                  <div
                                    data-theme="skies"
                                    className={statusClass(product.status)}
                                  >
                                    {product.status}
                                  </div>
                                  <div className="flex gap-x-3">
                                    <span className="font-semibold">
                                      Price:
                                    </span>
                                    <NumFormatWrapper
                                      value={249000}
                                      displayType="text"
                                      prefix="Rp. "
                                      thousandSeparator="."
                                      decimalSeparator=","
                                    />
                                  </div>
                                  <div className="flex flex-col gap-y-2">
                                    <span className="font-semibold">
                                      Variant:
                                    </span>
                                    <ProductVariant
                                      variants={product.variant}
                                    />
                                  </div>
                                </div>
                                <div
                                  data-theme="skies"
                                  className="hidden w-[55%] rounded-md p-3 md:block md:bg-transparent md:text-black lg:h-full lg:w-[500px]"
                                >
                                  <div className="mb-3 text-center font-semibold md:text-left">
                                    Description
                                  </div>
                                  <p>
                                    {product.description} Lorem ipsum dolor sit,
                                    amet consectetur adipisicing elit. Nulla
                                    cumque voluptatem libero nisi quod dolorem
                                    autem, ipsa deleniti eveniet eos velit totam
                                    veritatis. Necessitatibus distinctio
                                    cupiditate, magni dicta nihil sequi cumque
                                    quod? Reiciendis laborum commodi libero
                                    placeat ipsa cupiditate dolorum veritatis
                                    ratione. Voluptas autem vero dolores, vitae
                                    quidem laudantium quae.
                                  </p>
                                </div>
                              </div>
                              <div
                                data-theme="skies"
                                className="mt-5 rounded-md bg-base-100 p-3 md:hidden"
                              >
                                <div className="mb-2 text-center font-semibold">
                                  Description
                                </div>
                                <p>
                                  {product.description} Lorem ipsum dolor sit,
                                  amet consectetur adipisicing elit. Nulla
                                  cumque voluptatem libero nisi quod dolorem
                                  autem, ipsa deleniti eveniet eos velit totam
                                  veritatis. Necessitatibus distinctio
                                  cupiditate, magni dicta nihil sequi cumque
                                  quod? Reiciendis laborum commodi libero
                                  placeat ipsa cupiditate dolorum veritatis
                                  ratione. Voluptas autem vero dolores, vitae
                                  quidem laudantium quae.
                                </p>
                              </div>
                              <div className="absolute right-1 top-1 flex items-center justify-center gap-x-2 rounded-md p-3 sm:right-2 sm:top-2 lg:hidden">
                                <UpdateProductModal
                                  product={product}
                                  categories={categories!}
                                  index={index + 100}
                                  stateChanges={stateChanges}
                                />
                                <DeleteProductModal
                                  product={product}
                                  index={index + 100}
                                  stateChanges={stateChanges}
                                />
                              </div>
                            </div>
                          </Fragment>
                        );
                    })}
                  </div>
                </div>
              );
            }
          })}

          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text={"There's no products to display"} />
      )}
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
