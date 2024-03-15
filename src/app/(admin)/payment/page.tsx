import { Metadata } from "next";
import PaymentWrapper from "../../../../components/Wrapper/PaymentWrapper";
import { InfoSvg } from "../../../../components/Misc/SvgGroup";

export const metadata: Metadata = {
  title: "Heymale | Payment Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const PaymentDashboard = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-fit w-fit flex-col items-center justify-center gap-2 rounded-md bg-base-300 p-10 text-lg font-semibold text-white">
        <InfoSvg className="h-8 w-8 stroke-current" />
        <span>This page currently inactive</span>
      </div>
    </div>
    // <PaymentWrapper />
  );
};

export default PaymentDashboard;
