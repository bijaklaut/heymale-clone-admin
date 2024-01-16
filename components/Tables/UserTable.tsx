import { PaginationTypes, UserTypes } from "../../services/types";
import DeleteUserModal from "../Modals/User/DeleteUser";
import UpdateUserModal from "../Modals/User/UpdateUser";
import ChangePasswordModal from "../Modals/User/ChangePassword";
import { Dispatch, Fragment, SetStateAction } from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import AddressListModal from "../Modals/User/AddressList";

interface ProductTableProps {
  setChanges: Dispatch<SetStateAction<boolean>>;
  paginate: PaginationTypes;
  setPage: Dispatch<SetStateAction<number>>;
}

const UserTable = ({ paginate, setChanges, setPage }: ProductTableProps) => {
  const { docs: users } = paginate;
  return (
    <div className="max-w-5xl">
      {users.length ? (
        <Fragment>
          <table data-theme={"nord"} className="table w-fit rounded-md">
            <thead>
              <tr>
                <th className="text-center text-base font-semibold">#</th>
                <th className="text-center text-base font-semibold">Name</th>
                <th className="text-center text-base font-semibold">Email</th>
                <th className="text-center text-base font-semibold">
                  Phone Number
                </th>
                <th className="text-center text-base font-semibold">
                  Addresses
                </th>
                <th className="text-center text-base font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {(users as UserTypes[]).map((user, i: any) => {
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
                      <div className="flex min-h-full items-center justify-center gap-x-3">
                        <UpdateUserModal
                          user={user}
                          index={i}
                          setChanges={setChanges}
                        />
                        <DeleteUserModal
                          user={user}
                          index={i}
                          setChanges={setChanges}
                        />
                        <ChangePasswordModal
                          user={user}
                          index={i}
                          setChanges={setChanges}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination paginate={paginate} setPage={setPage} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no users to display" />
      )}
    </div>
  );
};

export default UserTable;
