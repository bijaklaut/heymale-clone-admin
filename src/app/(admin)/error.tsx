"use client";

import Image from "next/image";
import heymaleLogo from "@/../public/images/logo/heymale-logo.png";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-white">
      <Image
        src={heymaleLogo}
        height={180}
        width={180}
        className="mb-5 h-auto w-[200px]"
        alt="heymale-logo"
      />
      <p className="mb-3 text-neutral">
        An error has occured. Please refresh this page
      </p>
    </div>
  );
}
