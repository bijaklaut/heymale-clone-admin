import { Metadata } from "next";
import CreatePaymentModal from "../../../../components/Modals/Payment/CreatePayment";
import PaymentTable from "../../../../components/Tables/PaymentTable";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Heymale | Payment Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const PaymentDashboard = () => {
  // useLayoutEffect(() => {
  //   isAuth();
  // }, []);
  return (
    <>
      <h2 className="text-2xl font-semibold">Payment Dashboard</h2>

      <CreatePaymentModal />
      <PaymentTable />
    </>
  );
};

export default PaymentDashboard;
