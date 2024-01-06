import { Metadata } from "next";
import { getCategories } from "../../../../services/admin";
import ProductTableWrapper from "../../../../components/Tables/ProductTableWrapper";

export const metadata: Metadata = {
  title: "Heymale | Product Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const ProductDashboard = async () => {
  const { payload: categories } = await getCategories();

  return (
    <>
      <h2 className="text-2xl font-semibold">Product Dashboard</h2>

      <ProductTableWrapper categories={categories} />
    </>
  );
};

export default ProductDashboard;
