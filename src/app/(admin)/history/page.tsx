import { Metadata } from "next";
import { InfoSvg } from "../../../../components/Misc/SvgGroup";

export const metadata: Metadata = {
  title: "Heymale | History Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const HistoryDashboard = () => {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-fit w-fit -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center gap-2 rounded-md bg-base-300 p-10 text-lg font-semibold text-white">
      <InfoSvg className="h-8 w-8 stroke-current" />
      <span>This page currently inactive</span>
    </div>
  );
};

export default HistoryDashboard;
