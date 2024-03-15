import { useCallback, useEffect, useState } from "react";
import { OrderTypes } from "../../services/types";
import NumFormatWrapper from "../Wrapper/NumFormatWrapper";
import { ClockSvg, CopySvg } from "./SvgGroup";
import Image from "next/image";
import { PaymentInstruction } from "./PaymentInstruction";

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
  const [bank, setBank] = useState("");

  const transformDateTime = useCallback((time: string) => {
    if (time) {
      const theday = new Date(time);
      theday.setHours(theday.getHours() + theday.getTimezoneOffset() / 60);

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
    const reset = new Date(order?.transaction.expiry_time!);
    reset.setHours(reset.getHours() + reset.getTimezoneOffset() / 60);

    const expiry_time = Date.parse(reset.toUTCString()) - Date.now();

    if (expiry_time > 0) {
      let dummyHours = Math.floor((expiry_time / (1000 * 60 * 60)) % 24);
      let dummyMinutes = Math.floor((expiry_time / (1000 * 60)) % 60);
      let dummySeconds = Math.floor((expiry_time / 1000) % 60);

      let hours = dummyHours < 10 ? `0${dummyHours}` : dummyHours;
      let minutes = dummyMinutes < 10 ? `0${dummyMinutes}` : dummyMinutes;
      let seconds = dummySeconds < 10 ? `0${dummySeconds}` : dummySeconds;

      const timeString = `${hours} : ${minutes} : ${seconds}`;
      setCountdown(timeString);
    } else {
      setCountdown("EXPIRED");
    }
  }, [order]);

  const copyValue = useCallback(
    (value: string | number, element: HTMLButtonElement) => {
      const otherCopy = document.getElementsByClassName("copy");
      for (let i = 0; i < otherCopy.length; i++) {
        otherCopy[i].classList.add("opacity-0");
      }

      navigator.clipboard
        .writeText(value.toString())
        .then(() => {})
        .catch(() => {
          element.nextElementSibling!.innerHTML = "Not Supported";
          element.nextElementSibling!.classList.replace(
            "bg-primary/80",
            "bg-neutral/40",
          );
        })
        .finally(() => {
          element.nextElementSibling?.classList.remove("opacity-0");
          setTimeout(() => {
            element.nextElementSibling?.classList.add("opacity-0");
          }, 3500);
        });
    },
    [],
  );

  const getBank = useCallback(() => {
    if (order.transaction.va_numbers!.length > 0) {
      const getBank = virtual_accounts.find(
        (item) => item.value == order.transaction.va_numbers![0].bank,
      );
      return getBank ? setBank(getBank.value) : setBank("");
    }

    if (order.transaction.bill_key) {
      return setBank("mandiri");
    }

    if (order.transaction.permata_va_number) {
      return setBank("permata");
    }
  }, [order]);

  useEffect(() => {
    if (countdown != "EXPIRED") {
      const interval = setInterval(() => countdownGenerator(), 1000);
      return () => clearInterval(interval);
    }
  }, [order, countdown]);

  useEffect(() => {
    if (order) {
      getBank();
    }
  }, [order]);

  return (
    <div className="mx-auto flex w-full max-w-[500px] flex-col items-center justify-center gap-5">
      <h3 className="mb-5 text-xl font-semibold text-white">
        Waiting for Payment
      </h3>
      <div className="relative grid w-full grid-cols-[minmax(0,_1fr)_max-content] items-center overflow-hidden rounded-md bg-white  p-5 text-neutral">
        <div className="flex flex-col">
          <span className="text-sm">Payment Deadline:</span>
          <span>{transformDateTime(order.transaction.expiry_time!)}</span>
        </div>
        {countdown && (
          <div className="flex items-center gap-2 rounded-xl bg-error px-2 py-1 text-sm text-white">
            <ClockSvg className="h-5 w-5 stroke-current" />
            <span>{countdown}</span>
          </div>
        )}

        <div className="absolute left-0 h-[105%] w-2 rounded-l-md bg-error"></div>
      </div>
      <div className="grid w-full grid-cols-1 rounded-md bg-white p-5 text-neutral">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Invoice</span>
          <span>{order.invoice}</span>
        </div>
        <div className="divider divider-neutral my-5 opacity-10"></div>
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
            <button
              className="btn-icon-accent"
              onClick={(e) => copyValue(order.total_price, e.currentTarget)}
            >
              <CopySvg className="h-5 w-5 fill-current" />
            </button>
            <div
              data-theme="skies"
              className="copy rounded-lg bg-primary/80 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200"
            >
              Copied
            </div>
          </div>
        </div>
        <div className="divider divider-neutral my-5 opacity-10"></div>
        <div className="flex flex-col gap-3">
          <span className="text-sm">Virtual Account</span>
          {/* Permata Bank */}
          {bank == "permata" && (
            <div className="grid w-full grid-cols-[75px_1fr_min-content] items-center gap-5">
              <Image
                src={`/images/logo/permata.png`}
                width={200}
                height={200}
                alt={"permata"}
              />
              <div className="flex flex-col">
                <span>Permata Virtual Account</span>
                <div className="flex items-center gap-2">
                  <span>{order.transaction.permata_va_number}</span>
                  <button
                    className="btn-icon-accent"
                    onClick={(e) =>
                      copyValue(
                        order.transaction.permata_va_number!,
                        e.currentTarget,
                      )
                    }
                  >
                    <CopySvg className="h-5 w-5 fill-current" />
                  </button>
                  <div
                    data-theme="skies"
                    className="copy rounded-lg bg-primary/80 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200"
                  >
                    Copied
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer & Except Permata */}
          {bank != "permata" &&
            bank != "mandiri" &&
            virtual_accounts.map((va, index) => {
              return (
                va.value == bank && (
                  <div
                    key={index}
                    className="grid w-full grid-cols-[75px_1fr_min-content] items-center gap-5"
                  >
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
                        <button
                          className="btn-icon-accent"
                          onClick={(e) =>
                            copyValue(
                              order.transaction.va_numbers![0].va_number,
                              e.currentTarget,
                            )
                          }
                        >
                          <CopySvg className="h-5 w-5 fill-current" />
                        </button>
                        <div
                          data-theme="skies"
                          className="copy rounded-lg bg-primary/80 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200"
                        >
                          Copied
                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            })}

          {/* Mandiri E-Channel */}
          {bank == "mandiri" && (
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
                  <button
                    className="btn-icon-accent"
                    onClick={(e) =>
                      copyValue(
                        `${order.transaction.biller_code}${order.transaction.bill_key}`,
                        e.currentTarget,
                      )
                    }
                  >
                    <CopySvg className="h-5 w-5 fill-current" />
                  </button>
                  <div
                    data-theme="skies"
                    className="copy rounded-lg bg-primary/80 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200"
                  >
                    Copied
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="divider"></div>
        <PaymentInstruction bank={bank} />
      </div>
    </div>
  );
};

export default PendingOrder;
