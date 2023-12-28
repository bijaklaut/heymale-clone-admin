import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-white">
      <Image
        src={"/images/logo/heymale-logo.png"}
        height={180}
        width={180}
        className="mb-5 h-auto w-[200px]"
        alt="heymale-logo"
      />
    </div>
  );
}
