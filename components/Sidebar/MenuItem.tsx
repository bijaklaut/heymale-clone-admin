import Image from "next/image";
import { ReactNode } from "react";
import cx from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItemProps {
  href: string;
  children: ReactNode;
}

export const MenuItem = (props: MenuItemProps) => {
  const { href, children } = props;
  const pathname = usePathname();
  const classItem = cx({
    "font-semibold text-sm flex items-center gap-x-2 p-2 rounded-md transition-all hover:bg-gray-300":
      true,
    "bg-primary hover:bg-secondary text-white hover:cursor-default pointer-events-none shadow-md":
      pathname.includes(href),
  });

  return (
    <div>
      <Link href={href} className={classItem}>
        {children}
      </Link>
    </div>
  );
};
