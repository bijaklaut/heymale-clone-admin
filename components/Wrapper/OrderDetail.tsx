"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getOrderDetail } from "../../services/admin";
import Cookies from "js-cookie";
import { OrderTypes } from "../../services/types";
import { ClockSvg, CopySvg } from "../Misc/SvgGroup";
import NumFormatWrapper from "./NumFormatWrapper";
import Image from "next/image";
import PendingOrder from "../Misc/PendingOrder";

interface ThisProps {
  invoice: string;
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

const OrderDetailWrapper = ({ invoice }: ThisProps) => {
  const [order, setOrder] = useState<OrderTypes>();

  const getOrderDetailAPI = useCallback(async () => {
    const token = Cookies.get("token");
    const { payload } = await getOrderDetail(invoice, token!);
    setOrder(payload);
  }, [invoice]);

  // const transformDateTime = useCallback((time: string) => {
  //   if (time) {
  //     const theday = new Date(time);
  //     const date =
  //       theday.getDate() < 10 ? `0${theday.getDate()}` : theday.getDate();
  //     const month = theday.toDateString().split(" ")[1];
  //     const year = theday.getFullYear();
  //     const hours =
  //       theday.getHours() < 10 ? `0${theday.getHours()}` : theday.getHours();
  //     const minutes =
  //       theday.getMinutes() < 10
  //         ? `0${theday.getMinutes()}`
  //         : theday.getMinutes();
  //     const seconds =
  //       theday.getSeconds() < 10
  //         ? `0${theday.getSeconds()}`
  //         : theday.getSeconds();

  //     return `${date} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  //   }
  // }, []);

  // const countdownGenerator = useCallback(() => {
  //   const expiry_time =
  //     Date.parse(order?.transaction.expiry_time!) - Date.now();
  //   let dummyHours = Math.floor((expiry_time / (1000 * 60 * 60)) % 24);
  //   let dummyMinutes = Math.floor((expiry_time / (1000 * 60)) % 60);
  //   let dummySeconds = Math.floor((expiry_time / 1000) % 60);

  //   let hours = dummyHours < 10 ? `0${dummyHours}` : dummyHours;
  //   let minutes = dummyMinutes < 10 ? `0${dummyMinutes}` : dummyMinutes;
  //   let seconds = dummySeconds < 10 ? `0${dummySeconds}` : dummySeconds;

  //   const timeString = `${hours} : ${minutes} : ${seconds}`;
  //   setCountdown(timeString);
  // }, [order]);

  // useEffect(() => {
  //   const interval = setInterval(() => countdownGenerator(), 1000);
  //   console.log("ORDER: ", order);
  //   return () => clearInterval(interval);
  // }, [order]);

  useEffect(() => {
    getOrderDetailAPI();
  }, [invoice]);

  return (
    <Fragment>
      {order?.status == "pending" && <PendingOrder order={order} />}
    </Fragment>
  );
};

export default OrderDetailWrapper;
