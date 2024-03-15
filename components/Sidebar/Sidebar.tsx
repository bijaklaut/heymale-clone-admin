"use client";

import Image from "next/image";
import { MenuItem } from "./MenuItem";
import UserAction from "./UserAction";
import { useCallback, useEffect, useState } from "react";
import { getUserById } from "../../services/admin";
import SidebarLoading from "../Loading/SidebarLoading";
import Link from "next/link";
import heymaleLogo from "../../public/images/logo/heymale-logo.png";
import {
  ArrowRightSvg,
  CategorySvg,
  HistorySvg,
  PaymentSvg,
  ProductSvg,
  CardSvg,
  TransactionSvg,
  TruckSvg,
  UsersSvg,
  VoucherSvg,
} from "../Misc/SvgGroup";
import cx from "classnames";
import { TopNavbar } from "./TopNavbar";
import { getUserId } from "../../services/actions";

interface User {
  name: string;
  avatar: string;
}

export const Sidebar = () => {
  const [user, setUser] = useState<User>({
    name: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const sidebarClass = cx({
    "fixed left-0 top-0 right-0 z-20 flex w-full h-screen origin-top flex-col justify-between px-2 sm:pt-4 shadow-lg sm:origin-left sm:right-auto lg:pt-7 lg:sticky":
      true,
    "opacity-0 scale-y-0 sm:opacity-100 sm:scale-y-100 sm:w-[4rem]": !checked,
    "opacity-100 w-full scale-y-100 sm:w-[50%] lg:w-[22rem] xl:w[25rem]":
      checked,
  });
  const arrowClass = cx({
    "w-4 fill-white transition-all": true,
    "rotate-180": checked,
  });

  const resetNavbar = useCallback(() => {
    if (window.innerWidth < 640) {
      setChecked(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getUserAPI = useCallback(async () => {
    const local_user: User = JSON.parse(localStorage.getItem("user")!);

    if (local_user) {
      setUser(local_user);
    } else {
      let id = await getUserId();

      const { payload } = await getUserById(id);

      setUser({
        avatar: payload.avatar,
        name: payload.name,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ name: payload.name, avatar: payload.avatar }),
      );
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    getUserAPI();
  }, []);

  useEffect(() => {
    if (checked && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [checked]);

  return !isLoading ? (
    <div>
      <aside data-theme={"nord"} className={sidebarClass}>
        {checked ? (
          <>
            <div className="overflow-y-auto">
              {/* Tablet, Laptop, Desktop Title*/}
              <div className="title hidden h-[50px] w-full items-center justify-center sm:flex">
                <Link href={"/"}>
                  <Image
                    src={heymaleLogo}
                    width={180}
                    alt="heymale-logo"
                    className="h-auto w-[170px] sm:w-[180px]"
                  />
                </Link>
              </div>
              {/* Mobile Title */}
              <div className="title sticky top-0 flex h-[50px] w-full items-center justify-between py-8 ps-3 sm:hidden ">
                <Link href={"/"}>
                  <Image
                    src={heymaleLogo}
                    width={180}
                    alt="heymale-logo"
                    className="h-auto w-[170px] sm:w-[180px]"
                  />
                </Link>
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
                    <div className="btn btn-ghost label-text flex w-fit flex-col gap-y-[5px]">
                      <div className="h-[2px] w-5 bg-neutral"></div>
                      <div className="h-[2px] w-5 bg-neutral"></div>
                      <div className="h-[2px] w-5 bg-neutral"></div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="divider mb-2 mt-0"></div>
              <div className="w-full">
                <div className="menu-list flex flex-col gap-y-[5px]">
                  <div className="menu text-lg font-semibold text-gray-400 sm:text-sm sm:font-bold">
                    COMMERCIAL
                  </div>
                  <MenuItem onClick={resetNavbar} href="/order">
                    <CardSvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>Orders</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/history">
                    <HistorySvg className="sidebar-svg fill-current stroke-current" />
                    <p className={"sidebar-menu-text"}>History Transactions</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/shipment">
                    <TruckSvg className="sidebar-svg fill-current stroke-current" />
                    <p className={"sidebar-menu-text"}>Shipments</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/transaction">
                    <TransactionSvg className="sidebar-svg fill-current stroke-current" />
                    <p className={"sidebar-menu-text"}>Transactions</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/voucher">
                    <VoucherSvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>Vouchers</p>
                  </MenuItem>
                </div>

                <div className="menu-list mt-4 flex flex-col gap-y-[5px]">
                  <div className="menu text-lg font-semibold text-gray-400 sm:text-sm sm:font-bold">
                    ADMINISTRATION
                  </div>
                  <MenuItem onClick={resetNavbar} href="/category">
                    <CategorySvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>Categories</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/product">
                    <ProductSvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>Products</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/payment">
                    <PaymentSvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>Payments</p>
                  </MenuItem>
                  <MenuItem onClick={resetNavbar} href="/user">
                    <UsersSvg className="sidebar-svg stroke-current" />
                    <p className={"sidebar-menu-text"}>User Management</p>
                  </MenuItem>
                </div>
              </div>
            </div>
            <UserAction user={user} />
          </>
        ) : (
          <>
            <div>
              <Link
                href={"/"}
                className="title flex h-[50px] w-full items-center justify-center text-3xl font-bold"
              >
                H
              </Link>
              <div className="divider mb-4 mt-2"></div>
              <div className="w-full">
                <div className="menu-list flex flex-col items-center gap-y-[5px]">
                  <div className="menu text-lg font-semibold text-gray-400 sm:text-sm sm:font-bold">
                    COM
                  </div>
                  <MenuItem centered datatip={"Orders"} href="/order">
                    <CardSvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                  <MenuItem
                    centered
                    datatip={"History Transactions"}
                    href="/history"
                  >
                    <HistorySvg className="sidebar-svg fill-current stroke-current" />
                  </MenuItem>
                  <MenuItem centered datatip={"Shipments"} href="/shipment">
                    <TruckSvg className="sidebar-svg fill-current stroke-current" />
                  </MenuItem>
                  <MenuItem
                    centered
                    datatip={"Transactions"}
                    href="/transaction"
                  >
                    <TransactionSvg className="sidebar-svg fill-current stroke-current" />
                  </MenuItem>
                  <MenuItem centered datatip={"Vouchers"} href="/voucher">
                    <VoucherSvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                </div>

                <div className="menu-list mt-4 flex flex-col items-center gap-y-[5px]">
                  <div className="menu text-lg font-semibold text-gray-400 sm:text-sm sm:font-bold">
                    ADM
                  </div>
                  <MenuItem centered datatip={"Categories"} href="/category">
                    <CategorySvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                  <MenuItem centered datatip={"Products"} href="/product">
                    <ProductSvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                  <MenuItem centered datatip={"Payments"} href="/payment">
                    <PaymentSvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                  <MenuItem centered datatip={"User Management"} href="/user">
                    <UsersSvg className="sidebar-svg stroke-current" />
                  </MenuItem>
                </div>
              </div>
            </div>
            <UserAction user={user} compact />
          </>
        )}
        {/* Arrow to expand */}
        <div
          data-theme={"skies"}
          className="form-control absolute -right-4 top-7 hidden h-8  w-8 items-center justify-center rounded-full bg-base-100 p-1 sm:flex"
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
            <div className="label-text ">
              <ArrowRightSvg className={arrowClass} />
            </div>
          </label>
        </div>
      </aside>

      {/* Top Navbar */}
      <TopNavbar
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
    </div>
  ) : (
    <SidebarLoading />
  );
};
