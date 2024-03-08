"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownSvg, ArrowRightSvg } from "../Misc/SvgGroup";
import { Fragment, useState } from "react";
import cx from "classnames";
import { SignoutModal } from "./SignoutModal";
import { PUBLIC_API_IMG } from "../../constants";

interface ThisProps {
  user: {
    name: string;
    avatar: string;
  };
  compact?: boolean;
}

const UserAction = (props: ThisProps) => {
  const IMG = `${PUBLIC_API_IMG}/user`;
  const { user, compact = false } = props;
  const [checked, setChecked] = useState(false);
  const menuMobile = cx({
    "absolute origin-bottom sm:hidden -top-28 z-[1] w-full overflow-hidden duration-300 transition-all rounded-box p-2 shadow-md":
      true,
    "opacity-0 scale-0": !checked,
  });
  const menuExpand = cx({
    "absolute origin-left bottom-8 -right-[11rem] z-[1] w-40 overflow-hidden duration-300 transition-all rounded-box py-1 shadow-md":
      true,
    "opacity-0 scale-0": !checked,
  });
  const menuCompact = cx({
    "absolute origin-left bottom-8 -right-[10.5rem] z-[1] w-40 overflow-hidden duration-300 transition-all rounded-box py-1 shadow-md":
      true,
    "opacity-0 scale-0": !checked,
  });

  return (
    <Fragment>
      {compact ? (
        <div className="flex items-center justify-center gap-x-3 py-5 sm:py-2">
          <div
            data-tip={!checked ? user.name : null}
            className="form-control tooltip tooltip-right"
          >
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                className="peer checkbox hidden"
                onChange={() => {
                  setChecked((prev) => !prev);
                }}
              />
              {user.avatar ? (
                <div className="avatar label-text ">
                  <div className="w-[50px] rounded-full bg-white">
                    <Image
                      src={`${IMG}/${user.avatar}`}
                      width={50}
                      height={50}
                      alt={`${user.name}-avatar`}
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder label-text">
                  <div className="w-[50px] rounded-full bg-white text-neutral">
                    <span>{user.name[0]}</span>
                  </div>
                </div>
              )}
            </label>
          </div>
          <div data-theme={"nord"} className={menuCompact}>
            <ul
              tabIndex={0}
              className="flex flex-col gap-y-1 p-1 [&>li:hover]:bg-black/10 [&>li]:rounded-md [&>li]:px-3 [&>li]:py-2"
            >
              <li className="text-base lg:text-sm">
                <Link href={"/profile"}>
                  <div className="w-full">Profile</div>
                </Link>
              </li>
              <li className="text-base lg:text-sm">
                <SignoutModal />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="relative flex w-full items-center justify-between gap-x-3 bg-base-100 py-2 max-sm:sticky max-sm:bottom-0">
          {user.avatar ? (
            <div className="avatar">
              <div className="w-[50px] rounded-full bg-white">
                <Image
                  src={`${IMG}/${user.avatar}`}
                  width={50}
                  height={50}
                  alt={user.name[0]}
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="w-[50px] rounded-full bg-white text-neutral">
                <span>{user.name[0]}</span>
              </div>
            </div>
          )}

          <p className="text-base font-semibold sm:text-sm">{user.name}</p>

          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                className="peer checkbox hidden"
                onChange={() => {
                  setChecked((prev) => !prev);
                }}
              />
              <ArrowDownSvg className="label-text fill-current stroke-current transition-all peer-checked:rotate-180 sm:hidden" />
              <div className="label-text w-fit rounded-md px-2 py-1 transition-all hover:bg-gray-400/50">
                <ArrowRightSvg className="hidden w-4 fill-current transition-all sm:block" />
              </div>
            </label>
          </div>
          <div data-theme={"nord"} className={menuExpand}>
            <ul
              tabIndex={0}
              className="flex flex-col gap-y-1 p-1 [&>li:hover]:bg-black/10 [&>li]:rounded-md [&>li]:px-3 [&>li]:py-2"
            >
              <li className="text-base lg:text-sm">
                <Link href={"/profile"}>Profile</Link>
              </li>
              <li className="text-base lg:text-sm">
                <SignoutModal />
              </li>
            </ul>
          </div>
          <div data-theme={"skies"} className={menuMobile}>
            <ul
              tabIndex={0}
              className="flex flex-col gap-y-1 p-1 [&>li:hover]:bg-black/10 [&>li]:rounded-md [&>li]:px-3 [&>li]:py-2"
            >
              <li className="text-base">
                <Link href={"/profile"}>Profile</Link>
              </li>
              <li className="text-base">
                <SignoutModal />
              </li>
            </ul>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserAction;
