import Image from "next/image";
import { ReactNode } from "react";
import cx from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItemProps {
  item: string;
  href: string;
  children: ReactNode;
}

export const MenuItem = (props: MenuItemProps) => {
  const { item, href, children } = props;
  const pathname = usePathname();
  const classItem = cx({
    "font-semibold": true,
    "bg-secondary bg-opacity-70 hover:bg-secondary hover:cursor-default pointer-events-none":
      pathname.includes(href),
  });

  return (
    <li>
      <Link href={href} className={classItem}>
        <Image
          src={`/icon/${item}.svg`}
          width={25}
          height={25}
          alt={`icon-${item}`}
        />
        <p className="ms-1">{children}</p>
      </Link>
    </li>
  );
};
