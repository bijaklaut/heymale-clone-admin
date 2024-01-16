"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { PaginationTypes } from "../../services/types";
import { getUsers } from "../../services/admin";
import SearchFilter from "../Misc/SearchFilter";
import { initPagination } from "../../services/helper";
import CreateUserModal from "../Modals/User/CreateUser";
import SimpleTableLoading from "../Loading/SimpleTableLoading";
import UserTable from "../Tables/UserTable";

const UserWrapper = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<PaginationTypes>(initPagination());
  const [changes, setChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const changeSearch = (search: string) => {
    setSearch(search);
    setLoading(true);
  };

  // Needs further testing
  const getFilteredUser = useCallback(
    async (
      page: number,
      search: string,
      setPagination: Dispatch<SetStateAction<PaginationTypes>>,
      setLoading: Dispatch<SetStateAction<boolean>>,
    ) => {
      const { payload } = await getUsers(page, search);

      return setTimeout(() => {
        setLoading(false);
        setPagination(initPagination(payload));
      }, 500);
    },
    [search, changes, page],
  );

  useEffect(() => {
    const newPage = 1;

    getFilteredUser(newPage, search, setPagination, setLoading);
  }, [search, changes]);

  useEffect(() => {
    getFilteredUser(page, search, setPagination, setLoading);
  }, [page]);

  return (
    <>
      <h2 className="text-2xl font-semibold">User Dashboard</h2>
      <div className="mt-3 flex w-full flex-col gap-3 overflow-x-auto overflow-y-hidden py-3">
        <CreateUserModal setChanges={setChanges} />
        <SearchFilter
          data={{ search }}
          changeSearch={changeSearch}
          placeholder="Search user by name"
        />
        {!loading ? (
          <UserTable
            paginate={pagination}
            setChanges={setChanges}
            setPage={setPage}
          />
        ) : (
          <SimpleTableLoading />
        )}
      </div>
    </>
  );
};

export default UserWrapper;
