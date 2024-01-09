"use client";
import { NumericFormat, NumericFormatProps } from "react-number-format";

const NumFormatWrapper = (props: NumericFormatProps) => {
  return <NumericFormat {...props} />;
};

export default NumFormatWrapper;
