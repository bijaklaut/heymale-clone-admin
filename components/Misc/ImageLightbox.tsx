"use client";

import {
  Fragment,
  ImgHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import cx from "classnames";
import Image from "next/image";

interface ThisProps extends ImgHTMLAttributes<HTMLImageElement> {
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
  index: number;
}

export const ImageLightbox = ({
  alt,
  index,
  height,
  thumbnail,
  width,
}: ThisProps) => {
  const overlayRef = useRef<HTMLDialogElement>(null);

  const thumbnailClass = useCallback(() => {
    return cx({
      "xl:max-w-[100px] h-auto w-full max-w-[200px] rounded-md bg-transparent bg-cover":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, [thumbnail]);

  const imageClass = useCallback(() => {
    return cx({
      "h-auto w-full max-w-[300px] sm:max-w-[400px] rounded-md border-2 border-neutral bg-cover ":
        thumbnail,
      "h-auto w-full max-w-[200px] rounded-md bg-neutral p-5 sm:p-8":
        !thumbnail,
    });
  }, [thumbnail]);

  const overlayHandler = useCallback(
    (show: boolean) => {
      if (show) {
        overlayRef.current?.showModal();
        return 0;
      }
      overlayRef.current?.close();
    },
    [overlayRef, index],
  );

  return (
    <Fragment>
      <div className="group relative w-fit overflow-hidden">
        <div className="absolute top-1/2 z-20 -translate-y-[50%]">
          <Image
            src={thumbnail}
            width={width}
            height={height}
            alt={alt}
            className={thumbnailClass()}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2P4DwQACfsD/Z8fLAAAAAAASUVORK5CYII="
          />
          <div
            className="absolute top-0 flex h-full w-full scale-0 cursor-pointer flex-col items-center justify-center rounded-md bg-black/40 text-center text-white transition-all duration-300 group-hover:scale-100"
            onClick={() => overlayHandler(true)}
          >
            <span>Click to enlarge</span>
          </div>
        </div>
        <div
          data-theme="nord"
          className="skeleton z-10 h-[150px] w-[100px] rounded-lg"
        ></div>
      </div>
      <dialog ref={overlayRef} className="modal max-xl:transition-none">
        <div className="flex flex-col items-center gap-y-3">
          <Image
            src={thumbnail}
            width={width}
            height={height}
            alt={alt}
            className={imageClass()}
          />
          <button
            className="btn btn-sm w-fit xl:btn-md focus:outline-none focus:ring-0"
            onClick={() => overlayHandler(false)}
          >
            CLOSE
          </button>
        </div>
      </dialog>
    </Fragment>
  );
};
