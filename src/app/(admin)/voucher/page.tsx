import { Metadata } from "next";
import VoucherWrapper from "../../../../components/Wrapper/VoucherWrapper";

export const metadata: Metadata = {
  title: "Heymale | Voucher Dashboard",
  description: "Heymale Clone Project by Bijaklaut",
};

const VoucherDashboard = async () => {
  return <VoucherWrapper />;
};

export default VoucherDashboard;
