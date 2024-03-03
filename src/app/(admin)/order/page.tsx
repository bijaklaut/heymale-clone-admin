import { Metadata } from "next";
import OrderWrapper from "../../../../components/Wrapper/OrderWrapper";

export const metadata: Metadata = {
  title: "Heymale | Order Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const OrderDashboard = () => {
  return <OrderWrapper />;
};

export default OrderDashboard;
