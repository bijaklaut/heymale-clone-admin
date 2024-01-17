import { PaginationTypes, UserTypes } from "../../services/types";
import DeleteUserModal from "../Modals/User/DeleteUser";
import UpdateUserModal from "../Modals/User/UpdateUser";
import ChangePasswordModal from "../Modals/User/ChangePassword";
import { Dispatch, Fragment, MouseEventHandler, SetStateAction } from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import AddressListModal from "../Modals/User/AddressList";

interface ProductTableProps {
  stateChanges(): void;
  setChanges?: Dispatch<SetStateAction<boolean>>;
  paginate: PaginationTypes;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
}

const UserTable = ({
  paginate,
  stateChanges,
  paginateAction,
}: ProductTableProps) => {
  const { docs: users } = paginate;
  return (
    <div className="max-w-5xl">
      {users.length ? (
        <Fragment>
          <table data-theme={"nord"} className="table w-full rounded-md">
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
                    <th className="text-center">
                      {i + paginate.pagingCounter}
                    </th>
                    <td className="text-center">
                      <span className="font-semibold">{user.name}</span>
                    </td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">{user.phoneNumber}</td>
                    <td className="text-center">
                      <AddressListModal user={user} index={i} />
                    </td>
                    <td>
                      <div className="flex min-h-full items-center justify-center gap-x-3">
                        <UpdateUserModal
                          user={user}
                          index={i}
                          stateChanges={stateChanges}
                        />
                        <DeleteUserModal
                          user={user}
                          index={i}
                          stateChanges={stateChanges}
                        />
                        <ChangePasswordModal
                          user={user}
                          index={i}
                          stateChanges={stateChanges}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no users to display" />
      )}
    </div>
  );
};

export default UserTable;
