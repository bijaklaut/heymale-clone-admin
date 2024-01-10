import { Metadata } from "next";
import AddCategoryModal from "../../../../components/Modals/Category/CreateCategory";
import CategoryTable from "../../../../components/Tables/CategoryTable";
import { getCategories } from "../../../../services/admin";
import CategoryTableWrapper from "../../../../components/Wrapper/CategoryTableWrapper";

export const metadata: Metadata = {
  title: "Heymale | Category Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const CategoryDashboard = async () => {
  // const { payload: categories } = await getCategories();

  return (
    <>
      <h2 className="text-2xl font-semibold">Category Dashboard</h2>

      <CategoryTableWrapper />
      {/* <AddCategoryModal />
      <CategoryTable categories={categories} /> */}
    </>
  );
};

export default CategoryDashboard;
