import { Metadata } from "next";
import CheckoutWrapper from "../../../../components/Wrapper/CheckoutWrapper";

export const metadata: Metadata = {
  title: "Heymale | Checkout",
  description: "Heymale Clone Project by Bijaklaut",
};

const CheckoutPage = () => {
  return <CheckoutWrapper />;
};

export default CheckoutPage;
