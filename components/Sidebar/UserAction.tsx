"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserToken } from "../../services/types";
import { jwtDecode } from "jwt-decode";
import { authLogout } from "../../services/actions";
import { getUser } from "../../services/admin";

const UserAction = () => {
  const IMG = `${process.env.NEXT_PUBLIC_IMG}/user`;
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  useLayoutEffect(() => {
    const token = Cookies.get("token");
    const getUserAPI = async (id: string) => {
      const { payload } = await getUser(token!, id);

      setUser({
        avatar: payload.avatar,
        name: payload.name,
      });
    };

    if (token) {
      const reverse = atob(token);
      const { id } = jwtDecode<UserToken>(reverse);
      getUserAPI(id);
    }
  }, []);

  return (
    <div className="dropdown dropdown-top absolute bottom-0 left-0 flex w-full items-center justify-between py-5 ps-3">
      {user.avatar ? (
        <div className="avatar">
          <div className="w-[50px] rounded-full">
            <Image
              src={`${IMG}/${user.avatar}`}
              width={50}
              height={50}
              alt={`${user.name}-avatar`}
            />
          </div>
        </div>
      ) : (
        <div className="avatar placeholder">
          <div className="w-[50px] rounded-full bg-primary text-white">
            <span>{user.name[0]}</span>
          </div>
        </div>
      )}

      <p className="text-sm font-semibold">{user.name}</p>
      <div
        tabIndex={0}
        className="rounded-l-md p-3 shadow-none transition-all hover:bg-primary hover:bg-opacity-80"
      >
        <svg
          height={12}
          width={12}
          viewBox="-4.5 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M.366 19.708c.405.39 1.06.39 1.464 0l8.563-8.264a1.95 1.95 0 0 0 0-2.827L1.768.292A1.063 1.063 0 0 0 .314.282a.976.976 0 0 0-.011 1.425l7.894 7.617a.975.975 0 0 1 0 1.414L.366 18.295a.974.974 0 0 0 0 1.413"
            fill="#000"
            fillRule="evenodd"
          />
        </svg>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <Link href={"/profile"}>Profile</Link>
          </li>
          <li>
            <button type="button" onClick={async () => await authLogout()}>
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserAction;
