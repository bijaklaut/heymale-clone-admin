import { UserTypes } from "../../services/types";
import DeleteUserModal from "../Modals/User/DeleteUser";
import UpdateUserModal from "../Modals/User/UpdateUser";
import ChangePasswordModal from "../Modals/User/ChangePassword";
import AddressListModal from "../Modals/User/AddressList";
import { useEffect } from "react";

interface ProductTableProps {
  users: UserTypes[];
}

const UserTable = async (props: ProductTableProps) => {
  const { users } = props;

  return (
    <div className="mt-3 flex max-w-4xl flex-col gap-3 overflow-x-auto py-3">
      <table data-theme={"nord"} className="table w-fit rounded-md">
        <thead>
          <tr>
            <th className="text-center text-base font-semibold">#</th>
            <th className="text-center text-base font-semibold">Name</th>
            <th className="text-center text-base font-semibold">Email</th>
            <th className="text-center text-base font-semibold">
              Phone Number
            </th>
            <th className="text-center text-base font-semibold">Addresses</th>
            <th className="text-center text-base font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserTypes, i: any) => {
            return (
              <tr key={i}>
                <th className="text-center">{i + 1}</th>
                <td>
                  <span className="font-semibold">{user.name}</span>
                </td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <AddressListModal user={user} index={i} />
                </td>
                <td>
                  <div className="flex min-h-full flex-col items-center justify-center gap-y-2">
                    <UpdateUserModal user={user} index={i} />
                    <DeleteUserModal user={user} index={i} />
                    <ChangePasswordModal user={user} index={i} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
