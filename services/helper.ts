import { Dispatch, SetStateAction } from "react";
import { DataTypes, InitData, PostDataTypes, SetStateTypes } from "./types";

export const PopulateError = (
  validation: { field: string; message: string }[],
  data: PostDataTypes,
) => {
  for (const [key] of Object.entries(data)) {
    const element = document.getElementById(key);
    const val = validation.find((val) => val.field == key);
    const label = element?.parentNode?.querySelector("span.label-text-alt");

    if (val && element) {
      element.classList.add("input-error");
      label!.innerHTML = val.message;

      return 0;
    }

    element?.classList.remove("input-error");
    label!.innerHTML = "";
  }
};

export const modalHandler = (
  id: string,
  show: boolean,
  initialData: InitData,
  setState: SetStateTypes,
  data?: DataTypes,
) => {
  const { setData, setValidation, setLoading, setDisable } = setState;
  const modal = document.getElementById(id) as HTMLDialogElement;

  setValidation([
    {
      field: "",
      message: "",
    },
  ]);
  setDisable(true);
  setLoading(false);

  if (!show && data) {
    setData(initialData(data));
    return modal.close();
  }

  if (!show) {
    setData(initialData());
    return modal.close();
  }

  return modal.showModal();
};

export const buttonCheck = (
  data: PostDataTypes,
  requiredField: Array<string>,
  setDisable: Dispatch<SetStateAction<boolean>>,
) => {
  requiredField.map((field) => {
    if (!(data as any)[field]) return setDisable(true);
    setDisable(false);
  });
};
