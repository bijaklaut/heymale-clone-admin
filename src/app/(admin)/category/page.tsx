import { Metadata } from "next";
import CategoryTableWrapper from "../../../../components/Wrapper/CategoryTableWrapper";

export const metadata: Metadata = {
  title: "Heymale | Category Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const CategoryDashboard = async () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Category Dashboard</h2>
      <CategoryTableWrapper />
    </>
  );
};

export default CategoryDashboard;
