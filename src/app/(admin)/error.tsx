"use client";

import Image from "next/image";
import { RefreshSvg } from "../../../components/Misc/SvgGroup";

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
        src={"/images/logo/heymale-logo.png"}
        height={180}
        width={180}
        className="mb-5 h-auto w-[200px]"
        alt="heymale-logo"
      />
      <p className="mb-3 text-neutral">
        An error has occured. Please click the refresh button below
      </p>
      <button
        className="btn btn-neutral btn-sm text-white"
        onClick={() => reset()}
      >
        <RefreshSvg className="w-5 stroke-current transition-all " />
        <span>Refresh</span>
      </button>
    </div>
  );
}
