import { Metadata } from "next";
import TransactionWrapper from "../../../../components/Wrapper/TransactionWrapper";

export const metadata: Metadata = {
  title: "Heymale | Transaction Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const TransactionDashboard = () => {
  return <TransactionWrapper />;
};

export default TransactionDashboard;
