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
import DeleteProductModal from "../Modals/Product/DeleteProduct";
import UpdateProductModal from "../Modals/Product/UpdateProduct";
import cx from "classnames";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import { ProductExpand } from "../Misc/ProductExpand";
import { ProductVariant } from "../Misc/ProductVariant";
import DescriptionModal from "../Modals/Product/DescriptionModal";
import { ImageLightbox } from "../Misc/ImageLightbox";

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
  const [active, setActive] = useState(-1);

  const collapseClass = useCallback(
    (index: number) => {
      return cx({
        "flex h-fit w-full origin-top flex-col justify-between gap-x-3 rounded-md bg-white p-3 text-neutral shadow-md sm:px-5 md:h-full md:pt-8 lg:mx-auto lg:w-[80%] lg:px-16 lg:pt-3 xl:hidden":
          true,
        "static scale-100 opacity-100": active == index,
        "absolute scale-0 opacity-0": active != index,
      });
    },
    [active],
  );
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
                  <div className="grid grid-cols-1 gap-2">
                    {(products as ProductTypes[]).map((product, index) => {
                      if (product.category.name == fil.name)
                        return (
                          <Fragment key={index}>
                            <div className="product-parent-row">
                              {/* Number */}
                              <span className="me-1 justify-self-start font-semibold text-base-100/60 2xl:justify-self-center">
                                {paginate.pagingCounter + index}
                              </span>

                              {/* Main content */}
                              <div className="product-collapse-content">
                                {/* Thumbnail 3XL */}
                                <div className="hidden w-full justify-self-center xl:block">
                                  <ImageLightbox
                                    alt={`thumbnail-${product.name}`}
                                    index={index}
                                    height={500}
                                    width={500}
                                    thumbnail={product.thumbnail}
                                  />
                                </div>

                                {/* Product Name */}
                                <div className="justify-self-center text-center font-semibold md:justify-self-start md:text-start">
                                  {product.name}
                                </div>

                                {/* Price & Variant MD */}
                                <div className="product-price-variant">
                                  <div className="flex flex-col">
                                    <span className="font-semibold lg:hidden xl:inline 2xl:hidden">
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
                                  <div className="flex flex-col gap-y-2 ">
                                    <span className="font-semibold lg:hidden xl:inline 2xl:hidden">
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
                                <div className="hidden justify-self-center xl:block">
                                  <DescriptionModal
                                    product={product}
                                    index={index}
                                  />
                                </div>
                              </div>

                              {/* Expand or Action */}
                              <div className="justify-self-end 2xl:justify-self-center">
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

                            <div
                              id={`collapse${index}`}
                              className={collapseClass(index)}
                            >
                              <div className="flex items-center gap-x-3 md:mt-5 lg:mt-0 lg:gap-x-10">
                                <div className="flex w-[45%] md:justify-center">
                                  <ImageLightbox
                                    alt={`thumbnail-${product.name}`}
                                    index={index}
                                    height={1000}
                                    width={1000}
                                    thumbnail={product.thumbnail}
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
