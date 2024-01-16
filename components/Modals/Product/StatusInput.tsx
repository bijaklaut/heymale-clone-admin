import React, { Dispatch, SetStateAction } from "react";

interface StatusInputProps {
  dataState: { data: any; setData: Dispatch<SetStateAction<any>> };
  label: string;
}

const StatusInput = ({
  dataState: { data, setData },
  label,
}: StatusInputProps) => {
  return (
    <div className="w-full">
      <div className="label">
        <span className="label-text -ms-1 text-base text-white">
          Product Status
        </span>
      </div>
      <div className="flex w-full justify-between">
        <div className="form-control w-[48%]">
          <label className="label cursor-pointer justify-normal gap-x-10">
            <input
              type="radio"
              className="radio checked:radio-primary"
              onChange={() => {
                setData((prev: any) => ({ ...prev, [label]: "Active" }));
              }}
              checked={(data as any)[label] == "Active"}
            />
            <span className="label-text">Active</span>
          </label>
        </div>
        <div className="form-control w-[48%]">
          <label className="label cursor-pointer justify-normal gap-x-10">
            <input
              type="radio"
              className="radio checked:radio-error"
              onChange={() => {
                setData((prev: any) => ({ ...prev, [label]: "Inactive" }));
              }}
              checked={(data as any)[label] == "Inactive"}
            />
            <span className="label-text">Inactive</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StatusInput;
