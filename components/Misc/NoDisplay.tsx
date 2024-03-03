import React from "react";
import { NoDisplaySvg } from "./SvgGroup";

interface ThisProps {
  text: string;
}

const NoDisplay = ({ text }: ThisProps) => {
  return (
    <div className="mx-auto flex w-max flex-col items-center justify-center rounded-md bg-white px-16 py-10 text-neutral">
      <NoDisplaySvg className="h-10 w-10 stroke-current" />
      <p className="mt-3">{text}</p>
    </div>
  );
};

export default NoDisplay;
