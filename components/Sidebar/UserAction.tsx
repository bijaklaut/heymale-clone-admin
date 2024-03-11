"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownSvg, ArrowRightSvg } from "../Misc/SvgGroup";
import { Fragment, useCallback } from "react";
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

  const dropdownFocus = useCallback(() => {
    const getInput = document.getElementById("arrow") as HTMLInputElement;
    if (getInput) {
      getInput.checked = true;
    }
  }, []);

  const dropdownBlur = useCallback(() => {
    const getInput = document.getElementById("arrow") as HTMLInputElement;
    if (getInput) {
      getInput.checked = false;
    }
  }, []);

  return (
    <Fragment>
      {/* Folded or not */}
      {compact ? (
        <div className="flex items-center justify-center gap-x-3 py-5 sm:py-2">
          <div className="dropdown">
            <div tabIndex={0} role="button">
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
                  <div
                    data-theme="skies"
                    className="w-[50px] rounded-full bg-base-100 font-semibold text-white"
                  >
                    <span>{user.name[0]}</span>
                  </div>
                </div>
              )}
            </div>
            <div
              tabIndex={0}
              className={
                "dropdown-content absolute -top-[8.5rem] z-[1] w-[95vw] rounded-box bg-neutral-950 p-2 text-white shadow max-sm:-translate-x-[6px] sm:-right-[11rem] sm:-top-20 sm:w-40 sm:bg-slate-100 sm:p-1 sm:text-neutral"
              }
            >
              <ul
                className={
                  "flex w-full flex-col gap-y-1 p-1 [&>li:hover]:bg-white/10 sm:[&>li:hover]:bg-neutral/10 [&>li]:rounded-md [&>li]:px-3 [&>li]:py-2"
                }
              >
                <li className="text-base sm:text-sm">
                  {/* <Link href={"/profile"}>Profile</Link> */}
                  Profile
                </li>
                <li className="text-base sm:text-sm">
                  <SignoutModal />
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Mobile, Tablet & Desktop Unfolded
        <div className="relative flex w-full items-center justify-between gap-x-3 bg-base-100 py-2 max-sm:sticky max-sm:bottom-0">
          {/* Check if avatar exist */}
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
          <p className="text-center text-base font-semibold sm:text-sm">
            {user.name}
          </p>
          <div
            onFocus={dropdownFocus}
            onBlur={dropdownBlur}
            className="dropdown max-sm:dropdown-end"
          >
            {/* Button */}
            <div tabIndex={0} role="button" className="hover:bg-transparent">
              <input type="checkbox" className="peer hidden" id="arrow" />
              <ArrowDownSvg className="label-text fill-current stroke-current transition-all peer-checked:rotate-180 sm:hidden" />
              <div className="label-text w-fit rounded-md px-2 py-1 transition-all hover:bg-gray-400/50 max-sm:hidden">
                <ArrowRightSvg className="hidden w-4 fill-current transition-all sm:block" />
              </div>
            </div>
            {/* Content */}
            <div
              data-theme="skies"
              className="dropdown-content absolute -top-[8.5rem] z-[1] w-[95vw] rounded-box bg-neutral-950 p-2 text-white shadow max-sm:-translate-x-[6px] sm:-right-[11rem] sm:-top-20 sm:w-40 sm:bg-slate-100 sm:p-1 sm:text-neutral"
            >
              <ul
                tabIndex={0}
                className={
                  "flex w-full flex-col gap-y-1 p-1 [&>li:hover]:bg-white/10 sm:[&>li:hover]:bg-neutral/10 [&>li]:rounded-md [&>li]:px-3 [&>li]:py-2"
                }
              >
                <li className="text-base sm:text-sm">
                  {/* <Link  href={"/profile"}>Profile</Link> */}
                  Profile
                </li>
                <li className="text-base sm:text-sm">
                  <SignoutModal />
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserAction;
