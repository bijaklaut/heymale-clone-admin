import Image from "next/image";
import { MenuItem } from "./MenuItem";
import UserAction from "./UserAction";

export const Sidebar = () => {
  return (
    <aside
      data-theme={"nord"}
      className="fixed left-0 top-0 z-10 h-screen w-[17rem] px-2 py-7"
    >
      <div className="title mx-auto flex w-full items-center justify-center">
        <Image
          src={"/images/logo/heymale-logo.png"}
          width={180}
          height={180}
          alt="heymale-logo"
          className="h-auto w-[180px]"
        />
      </div>
      <div className="divider mt-10"></div>
      <ul className="menu w-full">
        <span className="mb-3 ms-4 font-bold text-gray-600">COMMERCIAL</span>
        <MenuItem item="transaction" href="/transaction">
          Transactions
        </MenuItem>
        <MenuItem item="history" href="/history">
          History Transactions
        </MenuItem>
        <MenuItem item="voucher" href="/voucher">
          Vouchers
        </MenuItem>

        <span className="mb-3 ms-4 mt-5 font-bold text-gray-600">
          ADMINISTRATION
        </span>
        <MenuItem item="category" href="/category">
          Categories
        </MenuItem>
        <MenuItem item="product" href="/product">
          Products
        </MenuItem>
        <MenuItem item="payment" href="/payment">
          Payments
        </MenuItem>
        <MenuItem item="usermgm" href="/user">
          User Management
        </MenuItem>
      </ul>
      <UserAction />
    </aside>
  );
};
