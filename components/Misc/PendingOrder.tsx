import { useCallback, useEffect, useState } from "react";
import { OrderTypes } from "../../services/types";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import { ClockSvg, CopySvg } from "./SvgGroup";
import Image from "next/image";

interface ThisProps {
  order: OrderTypes;
}

const virtual_accounts = [
  {
    value: "bca",
    text: "BCA Virtual Account",
  },
  {
    value: "bni",
    text: "BNI Virtual Account",
  },
  {
    value: "bri",
    text: "BRI Virtual Account",
  },
  {
    value: "mandiri",
    text: "Mandiri Virtual Account",
  },
  {
    value: "cimb",
    text: "CIMB Virtual Account",
  },
  {
    value: "permata",
    text: "Permata Virtual Account",
  },
];

const PendingOrder = ({ order }: ThisProps) => {
  const [countdown, setCountdown] = useState("");

  const transformDateTime = useCallback((time: string) => {
    if (time) {
      const theday = new Date(time);
      const date =
        theday.getDate() < 10 ? `0${theday.getDate()}` : theday.getDate();
      const month = theday.toDateString().split(" ")[1];
      const year = theday.getFullYear();
      const hours =
        theday.getHours() < 10 ? `0${theday.getHours()}` : theday.getHours();
      const minutes =
        theday.getMinutes() < 10
          ? `0${theday.getMinutes()}`
          : theday.getMinutes();
      const seconds =
        theday.getSeconds() < 10
          ? `0${theday.getSeconds()}`
          : theday.getSeconds();

      return `${date} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    }
  }, []);

  const countdownGenerator = useCallback(() => {
    const expiry_time =
      Date.parse(order?.transaction.expiry_time!) - Date.now();
    let dummyHours = Math.floor((expiry_time / (1000 * 60 * 60)) % 24);
    let dummyMinutes = Math.floor((expiry_time / (1000 * 60)) % 60);
    let dummySeconds = Math.floor((expiry_time / 1000) % 60);

    let hours = dummyHours < 10 ? `0${dummyHours}` : dummyHours;
    let minutes = dummyMinutes < 10 ? `0${dummyMinutes}` : dummyMinutes;
    let seconds = dummySeconds < 10 ? `0${dummySeconds}` : dummySeconds;

    const timeString = `${hours} : ${minutes} : ${seconds}`;
    setCountdown(timeString);
  }, [order]);

  useEffect(() => {
    const interval = setInterval(() => countdownGenerator(), 1000);
    console.log("ORDER: ", order);
    return () => clearInterval(interval);
  }, [order]);

  return (
    <div className="mx-auto flex w-[500px] flex-col items-center justify-center gap-5">
      <h3 className="mb-5 text-xl font-semibold text-white">
        Waiting for Payment
      </h3>
      <div
        data-theme="nord"
        className="relative grid w-full grid-cols-[minmax(0,_1fr)_max-content] items-center overflow-hidden rounded-md  p-5 text-neutral"
      >
        <div className="flex flex-col">
          <span className="text-sm">Payment Deadline:</span>
          <span>{transformDateTime(order.transaction.expiry_time!)}</span>
        </div>
        {countdown && (
          <div className="flex items-center gap-2 rounded-lg bg-orange-500 px-2 py-1 text-sm text-base-100">
            <ClockSvg className="h-5 w-5 stroke-current" />
            <span>{countdown}</span>
          </div>
        )}

        <div className="absolute left-0 h-full w-2 bg-orange-500"></div>
      </div>
      <div
        data-theme="nord"
        className="grid w-full grid-cols-1 rounded-md p-5 text-neutral"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm">Invoice</span>
          <span>{order.invoice}</span>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Total Payment</span>
          <div className="flex items-center gap-2">
            <NumFormatWrapper
              value={order.total_price}
              displayType="text"
              prefix="Rp. "
              thousandSeparator="."
              decimalSeparator=","
            />
            <CopySvg className="btn-icon-accent h-5 w-5 fill-current" />
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col gap-3">
          <span className="text-sm">Virtual Account</span>
          {order.transaction.payment_type == "bank_transfer" &&
            virtual_accounts.map((va) => {
              return (
                va.value == order.transaction.va_numbers![0].bank && (
                  <div className="grid w-full grid-cols-[75px_1fr_min-content] items-center gap-5">
                    <Image
                      src={`/images/logo/${va.value}.png`}
                      width={200}
                      height={200}
                      alt={va.value}
                    />
                    <div className="flex flex-col">
                      <span>{va.text}</span>
                      <div className="flex items-center gap-2">
                        <span>
                          {order.transaction.va_numbers![0].va_number}
                        </span>
                        <CopySvg className="btn-icon-accent h-5 w-5 fill-current" />
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          {order.transaction.payment_type == "echannel" && (
            <div className="grid w-full grid-cols-[75px_1fr_min-content] items-center gap-5">
              <Image
                src={`/images/logo/mandiri.png`}
                width={200}
                height={200}
                alt={"mandiri"}
              />
              <div className="flex flex-col">
                <span>Mandiri Virtual Account</span>
                <div className="flex items-center gap-2">
                  <span>{`${order.transaction.biller_code}-${order.transaction.bill_key}`}</span>
                  <CopySvg className="btn-icon-accent h-5 w-5 fill-current" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="divider"></div>
        <div className="flex flex-col gap-3">
          <span className="text-sm">How to Pay</span>
          <div className="flex flex-col gap-2">
            <div className="collapse collapse-arrow rounded-md border border-white/50 bg-white shadow-md">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">
                Mobile Banking / m-BCA
              </div>
              <div className="collapse-content">
                <p>Some instructions</p>
              </div>
            </div>
            <div className="collapse collapse-arrow rounded-md border border-white/50 bg-white shadow-md">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">
                Internet Banking / Klik-BCA
              </div>
              <div className="collapse-content">
                <p>Some instructions</p>
              </div>
            </div>
            <div className="collapse collapse-arrow rounded-md border border-white/50 bg-white shadow-md">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">ATM BCA</div>
              <div className="collapse-content">
                <p>Some instructions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingOrder;
