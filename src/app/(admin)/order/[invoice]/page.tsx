import { Metadata } from "next";
import OrderDetailWrapper from "../../../../../components/Wrapper/OrderDetail";

export const metadata: Metadata = {
  title: "Heymale | Order Detail",
  description: "Heymale Clone Project by Bijaklaut",
};

interface ThisProps {
  params: {
    invoice: string;
  };
}

const OrderDetail = ({ params: { invoice } }: ThisProps) => {
  return <OrderDetailWrapper invoice={invoice} />;
};

export default OrderDetail;
