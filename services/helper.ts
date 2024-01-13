import { Dispatch, SetStateAction } from "react";
import {
  DataTypes,
  InitData,
  PostDataTypes,
  SetStateTypes,
  ValidationTypes,
} from "./types";

export const populateError = (
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

export const populateErrorFloating = (
  validation: { field: string; message: string }[],
  data: PostDataTypes,
) => {
  for (const [key] of Object.entries(data)) {
    const element = document.getElementById(key);
    const val = validation.find((val) => val.field == key);
    const label = element?.parentNode?.querySelector("span.invalid-feedback");

    if (val && element) {
      element.classList.add("is-invalid");
      label!.innerHTML = val.message;

      return 0;
    }

    element?.classList.remove("is-invalid");
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

  if (!show && data) {
    setValidation([]);
    setDisable(true);
    setLoading(false);
    setData(initialData(data));
    return modal.close();
  }

  if (!show) {
    setValidation([]);
    setDisable(true);
    setLoading(false);
    setData(initialData());
    return modal.close();
  }

  return modal.showModal();
};

export const simpleModalHandler = (id: string, show: boolean) => {
  const modal = document.getElementById(id) as HTMLDialogElement;

  if (modal && show) {
    modal.showModal();
  } else if (modal && show == false) {
    modal.close();
  }
};

export const buttonCheck = (
  data: PostDataTypes,
  requiredField: Array<string>,
  setDisable: Dispatch<SetStateAction<boolean>>,
  oldData?: DataTypes,
) => {
  requiredField.map((field) => {
    if (oldData) {
      if (
        !(data as any)[field] ||
        (data as any)[field] == (oldData as any)[field]
      )
        return setDisable(true);
    }
    if (!(data as any)[field]) return setDisable(true);
    setDisable(false);
  });
};

export const populateValidation = (
  error: any,
  setValidation: Dispatch<SetStateAction<ValidationTypes[]>>,
) => {
  for (const [key] of Object.entries(error.errorDetail)) {
    setValidation((prev) => [
      ...prev,
      {
        field: key,
        message: error.errorDetail[key].message,
      },
    ]);
  }
};
