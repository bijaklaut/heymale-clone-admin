import { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import cx from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  centered?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  datatip?: string;
}

export const MenuItem = (props: MenuItemProps) => {
  const { href, children, centered = false, onClick, datatip = "" } = props;
  const pathname = usePathname();
  const classItem = cx({
    "font-semibold text-sm flex items-center gap-x-2 p-2 rounded-md transition-all hover:bg-gray-300":
      true,
    "bg-primary hover:bg-secondary text-white hover:cursor-default pointer-events-none shadow-md":
      pathname.includes(href),
    "justify-center tooltip tooltip-right": centered,
  });

  return (
    <Link
      data-tip={datatip}
      href={href}
      className={classItem}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
