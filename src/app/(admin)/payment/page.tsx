import { Metadata } from "next";
import PaymentWrapper from "../../../../components/Wrapper/PaymentWrapper";

export const metadata: Metadata = {
  title: "Heymale | Payment Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const PaymentDashboard = () => {
  return <PaymentWrapper />;
};

export default PaymentDashboard;
