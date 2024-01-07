"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserToken } from "../../services/types";
import { jwtDecode } from "jwt-decode";
import { authLogout } from "../../services/actions";
import { getUser } from "../../services/admin";
import { ArrowRightSvg } from "../Misc/SvgGroup";

interface ThisProps {
  user: {
    name: string;
    avatar: string;
  };
}

const UserAction = (props: ThisProps) => {
  const { user } = props;
  const IMG = `${process.env.NEXT_PUBLIC_IMG}/user`;

  return (
    <div className="dropdown dropdown-right absolute bottom-0 left-0 flex w-full items-center justify-between py-5 ps-3">
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
        className="parent-hover cursor-pointer rounded-l-md p-2 shadow-none transition-all active:bg-primary active:bg-opacity-80"
      >
        <ArrowRightSvg className="w-5 stroke-current" />
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 -translate-y-10 translate-x-1 rounded-box bg-base-100 p-2 shadow-md"
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
