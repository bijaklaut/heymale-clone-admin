import { Metadata } from "next";
import CategoryTableWrapper from "../../../../components/Wrapper/CategoryTableWrapper";

export const metadata: Metadata = {
  title: "Heymale | Category Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const CategoryDashboard = async () => {
  return (
    <>
      <CategoryTableWrapper />
    </>
  );
};

export default CategoryDashboard;
