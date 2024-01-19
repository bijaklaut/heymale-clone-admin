import Link from "next/link";
import heymaleLogo from "../../public/images/logo/heymale-logo.png";
import Image from "next/image";
import { InputHTMLAttributes } from "react";

interface ThisProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean | undefined;
}

export const TopNavbar = ({ checked, onChange }: ThisProps) => {
  return (
    <nav
      data-theme={"nord"}
      className="title fixed left-0 right-0 top-0 z-10 flex h-[50px] w-full items-center justify-between py-8 pe-2 ps-5 sm:hidden "
    >
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
            onChange={onChange}
          />
          <div className="btn btn-ghost label-text flex w-fit flex-col gap-y-[5px]">
            <div className="h-[2px] w-5 bg-neutral"></div>
            <div className="h-[2px] w-5 bg-neutral"></div>
            <div className="h-[2px] w-5 bg-neutral"></div>
          </div>
        </label>
      </div>
    </nav>
  );
};
