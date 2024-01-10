import { Metadata } from "next";
import PaymentTableWrapper from "../../../../components/Wrapper/PaymentTableWrapper";

export const metadata: Metadata = {
  title: "Heymale | Payment Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const PaymentDashboard = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Payment Dashboard</h2>
      <PaymentTableWrapper />
    </>
  );
};

export default PaymentDashboard;
