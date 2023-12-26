import Image from "next/image";
import { getPayments } from "../../services/admin";
import { PaymentTypes } from "../../services/types";
import DeletePaymentModal from "../Modals/Payment/DeletePayment";
import UpdatePaymentModal from "../Modals/Payment/UpdatePayment";

const PaymentTable = async () => {
  const { payload } = await getPayments();

  return (
    <div data-theme="nord" className="mt-3 max-w-4xl rounded-md py-3">
      <table className="table">
        <thead>
          <tr>
            <th className="w-[70px] text-center text-base font-semibold">#</th>
            <th className="min-w-[250px] text-center text-base font-semibold">
              Owner Name
            </th>
            <th className="min-w-[250px] text-center text-base font-semibold">
              Bank Account
            </th>
            <th className="min-w-[150px] text-center text-base font-semibold">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {payload.map((payment: PaymentTypes, i: any) => {
            return (
              <tr key={i} className="hover h-full">
                <th className="text-center">{i + 1}</th>
                <td className="text-center">{payment.ownerName}</td>
                <td>
                  <div className="flex w-full flex-col items-center gap-1">
                    <Image
                      src={`/images/logo/bank-${payment.bankName.toLowerCase()}.png`}
                      width={50}
                      height={50}
                      alt={`logo-${payment.bankName}`}
                      className="bg-cover"
                    />
                    <span>No: {payment.accountNo}</span>
                  </div>
                </td>
                <td className="flex min-h-[70px] w-full items-center justify-center">
                  <UpdatePaymentModal payment={payment} index={i} />

                  <DeletePaymentModal payment={payment} index={i} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
