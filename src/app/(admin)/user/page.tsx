import { Metadata } from "next";
import { getUser } from "../../../../services/admin";
import UserTable from "../../../../components/Tables/UserTable";
import CreateUserModal from "../../../../components/Modals/User/CreateUser";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Heymale | User Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const UserDashboard = async () => {
  const token = cookies().get("token")?.value;
  const { payload: users } = await getUser(token!);

  return (
    <>
      <h2 className="text-2xl font-semibold">User Dashboard</h2>
      <CreateUserModal />
      <UserTable users={users} />
    </>
  );
};

export default UserDashboard;
