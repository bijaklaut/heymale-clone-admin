import { Metadata } from "next";
import ProductTable from "../../../../components/Tables/ProductTable";
import CreateProductModal from "../../../../components/Modals/Product/CreateProduct";
import { getCategories, getProducts } from "../../../../services/admin";

export const metadata: Metadata = {
  title: "Heymale | Product Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const ProductDashboard = async () => {
  const { payload: products } = await getProducts();
  const { payload: categories } = await getCategories();

  return (
    <>
      <h2 className="text-2xl font-semibold">Product Dashboard</h2>

      <CreateProductModal categories={categories} />
      <ProductTable products={products} categories={categories} />
    </>
  );
};

export default ProductDashboard;
