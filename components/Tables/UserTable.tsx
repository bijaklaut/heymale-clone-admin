import { PaginationTypes, UserTypes } from "../../services/types";
import DeleteUserModal from "../Modals/User/DeleteUser";
import UpdateUserModal from "../Modals/User/UpdateUser";
import ChangePasswordModal from "../Modals/User/ChangePassword";
import { Dispatch, Fragment, MouseEventHandler, SetStateAction } from "react";
import NoDisplay from "../Misc/NoDisplay";
import Pagination from "../Misc/Pagination";
import AddressListModal from "../Modals/User/AddressList";
import { MailSvg, PhoneSvg, UserSvg } from "../Misc/SvgGroup";

interface ThisProps {
  stateChanges(): void;
  setChanges?: Dispatch<SetStateAction<boolean>>;
  paginate: PaginationTypes;
  paginateAction: MouseEventHandler<HTMLButtonElement>;
}

const UserTable = ({ paginate, stateChanges, paginateAction }: ThisProps) => {
  const { docs: users } = paginate;
  return (
    <div className="max-w-[1536px]">
      {users.length ? (
        <Fragment>
          <div
            data-theme="nord"
            className="rounded-md bg-transparent md:bg-base-100 md:p-3"
          >
            <div className="hidden font-semibold md:grid md:grid-cols-number-5 md:justify-items-center lg:grid-cols-number-6">
              <div className="">#</div>
              <div className="lg:hidden">User</div>
              <div className="max-lg:hidden">Name</div>
              <div className="max-lg:hidden">Email</div>
              <div>Phone Number</div>
              <div>Addresses</div>
              <div></div>
            </div>
            <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 lg:col-span-6">
              {(users as UserTypes[]).map((user, i) => {
                return (
                  <div
                    key={i}
                    tabIndex={i}
                    data-theme="nord"
                    className="group grid w-full grid-cols-1 items-center justify-items-center overflow-hidden rounded-md px-2 py-3 md:col-span-5 md:grid-cols-number-5 md:px-0 lg:col-span-6 lg:grid-cols-number-6"
                  >
                    <div className="mb-3 font-semibold text-black/50 md:mb-0">
                      <span className="md:hidden">#</span>
                      <span className="xl:text-base">
                        {paginate.pagingCounter + i}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-y-2 md:col-span-2 md:grid-cols-2 md:justify-items-center md:justify-self-stretch lg:col-span-3 lg:grid-cols-3">
                      <div className="grid grid-cols-1 gap-y-2 md:justify-items-center md:gap-y-0 lg:col-span-2 lg:grid-cols-2 lg:justify-items-center lg:justify-self-stretch">
                        <div className="flex items-center gap-x-3">
                          <UserSvg className="stroke-current md:hidden" />
                          <span className="text-sm md:font-semibold lg:font-normal xl:text-base">
                            {user.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <MailSvg className="stroke-current md:hidden" />
                          <span className="text-sm xl:text-base">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <PhoneSvg className="stroke-current md:hidden" />
                        <span className="text-sm xl:text-base">
                          {user.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 flex w-full items-center justify-center gap-x-8 max-md:translate-y-20 max-md:opacity-0 max-md:transition-all max-md:duration-500 max-md:group-hover:translate-y-0 max-md:group-hover:opacity-100 max-md:group-focus:translate-y-0 max-md:group-focus:opacity-100 md:col-span-2 md:mt-0 md:grid md:grid-cols-2 md:justify-items-center md:gap-x-0 ">
                      <AddressListModal
                        user={user}
                        index={i}
                        stateChanges={stateChanges}
                      />
                      <div className="flex items-center gap-x-8 md:gap-x-3">
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Pagination paginate={paginate} onClick={paginateAction} />
        </Fragment>
      ) : (
        <NoDisplay text="There's no users to display" />
      )}
    </div>
  );
};

export default UserTable;
