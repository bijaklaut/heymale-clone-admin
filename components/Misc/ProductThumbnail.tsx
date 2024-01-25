import Image from "next/image";
import { ImgHTMLAttributes, useCallback } from "react";
import cx from "classnames";

interface ThisProps extends ImgHTMLAttributes<HTMLImageElement> {
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
}

export const ProductThumbnail = ({
  alt,
  height,
  thumbnail,
  width,
}: ThisProps) => {
  const IMG_API = process.env.NEXT_PUBLIC_IMG;
  const IMG_URL = thumbnail
    ? `${IMG_API}/product/${thumbnail}`
    : "icon/image.svg";

  const imageClass = useCallback(() => {
    return cx({
      "h-auto w-full max-w-[200px] rounded-md border-2 border-neutral bg-cover":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, [thumbnail]);

  return (
    <Image
      src={IMG_URL}
      width={width}
      height={height}
      alt={alt}
      className={imageClass()}
    />
  );
};
