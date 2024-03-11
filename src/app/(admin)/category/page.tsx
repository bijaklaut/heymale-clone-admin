import { Metadata } from "next";
import CategoryWrapper from "../../../../components/Wrapper/CategoryWrapper";

export const metadata: Metadata = {
  title: "Heymale | Category Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const CategoryDashboard = async () => {
  return <CategoryWrapper />;
};

export default CategoryDashboard;
