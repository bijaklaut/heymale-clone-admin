import { Metadata } from "next";
import OrderWrapper from "../../../../components/Wrapper/OrderWrapper";

export const metadata: Metadata = {
  title: "Heymale | Order Dashboard",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
};

const OrderDashboard = () => {
  return <OrderWrapper />;
};

export default OrderDashboard;
