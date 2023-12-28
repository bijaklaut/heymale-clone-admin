"use client";

import Image from "next/image";
import { MenuItem } from "./MenuItem";
import UserAction from "./UserAction";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUser } from "../../services/admin";
import { jwtDecode } from "jwt-decode";
import { UserToken } from "../../services/types";
import SidebarLoading from "../Loading/SidebarLoading";
import Link from "next/link";
import heymaleLogo from "../../public/images/logo/heymale-logo.png";
import {
  CategorySvg,
  HistorySvg,
  PaymentSvg,
  ProductSvg,
  TransactionSvg,
  UserSvg,
  VoucherSvg,
} from "../Misc/SvgGroup";

export const Sidebar = () => {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const getUserAPI = async (id: string) => {
      const { payload } = await getUser(token!, id);

      setUser({
        avatar: payload.avatar,
        name: payload.name,
      });
      setIsLoading(false);
    };

    if (token) {
      const reverse = atob(token);
      const { id } = jwtDecode<UserToken>(reverse);
      getUserAPI(id);
    }
  }, []);

  return !isLoading ? (
    <aside
      data-theme={"nord"}
      className="fixed left-0 top-0 z-10 h-screen w-[17rem] px-3 py-7"
    >
      <div className="title mx-auto flex h-[50px] w-full items-center justify-center">
        <Link href={"/"}>
          <Image
            src={heymaleLogo}
            width={180}
            height={180}
            alt="heymale-logo"
            className="h-auto w-[180px]"
            priority
          />
        </Link>
      </div>
      <div className="divider mt-10"></div>
      <div className="w-full">
        <div className="menu mx-auto text-sm font-bold text-gray-400">
          <p>COMMERCIAL</p>
        </div>
        <MenuItem href="/transaction">
          <TransactionSvg className="stroke-current" />
          <p className="ms-1">Transactions</p>
        </MenuItem>
        <MenuItem href="/history">
          <HistorySvg className="fill-current stroke-current" />
          <p className="ms-1">History Transactions</p>
        </MenuItem>
        <MenuItem href="/voucher">
          <VoucherSvg className="stroke-current" />
          <p className="ms-1">Vouchers</p>
        </MenuItem>

        <div className="menu mx-auto mt-5 text-sm font-bold text-gray-400">
          <p>ADMINISTRATION</p>
        </div>
        <MenuItem href="/category">
          <CategorySvg className="stroke-current" />
          <p className="ms-1">Categories</p>
        </MenuItem>
        <MenuItem href="/product">
          <ProductSvg className="stroke-current" />
          <p className="ms-1">Products</p>
        </MenuItem>
        <MenuItem href="/payment">
          <PaymentSvg className="stroke-current" />
          <p className="ms-1">Payments</p>
        </MenuItem>
        <MenuItem href="/user">
          <UserSvg className="stroke-current" />
          <p className="ms-1">User Management</p>
        </MenuItem>
      </div>
      <UserAction user={user} />
    </aside>
  ) : (
    <SidebarLoading />
  );
};
