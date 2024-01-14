import { Metadata } from "next";
import { getCategories } from "../../../../services/admin";
import ProductWrapper from "../../../../components/Wrapper/ProductWrapper";

export const metadata: Metadata = {
  title: "Heymale | Product Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const ProductDashboard = async () => {
  const { payload } = await getCategories("");
  const { docs: categories } = payload;
  return (
    <>
      <ProductWrapper categories={categories} />
    </>
  );
};

export default ProductDashboard;
