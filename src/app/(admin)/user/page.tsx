import { Metadata } from "next";
import UserWrapper from "../../../../components/Wrapper/UserWrapper";

export const metadata: Metadata = {
  title: "Heymale | User Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const UserDashboard = async () => {
  return <UserWrapper />;
};

export default UserDashboard;
