import { Metadata } from "next";
import AddCategoryModal from "../../../../components/Modals/Category/CreateCategory";
import CategoryTable from "../../../../components/Tables/CategoryTable";

export const metadata: Metadata = {
  title: "Heymale | Category Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const CategoryDashboard = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Category Dashboard</h2>

      <AddCategoryModal />
      <CategoryTable />
    </>
  );
};

export default CategoryDashboard;
