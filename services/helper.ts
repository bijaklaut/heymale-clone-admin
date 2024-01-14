import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  DataTypes,
  InitData,
  PostDataTypes,
  SetStateTypes,
  ValidationTypes,
} from "./types";

// Need further research about bug on update modal (many)
const populateError = (
  validations: { field: string; message: string }[],
  data: PostDataTypes,
  index?: number,
) => {
  index = index || 0;
  for (const [key] of Object.entries(data)) {
    const element = document.getElementById(`${key}${index}`);
    const validation = validations.find((val) => val.field == key);
    const label = element?.parentNode?.querySelector("span.label-text-alt");

    if (validation && element) {
      element.classList.add("input-error");
      label!.innerHTML = validation.message;
    }

    if (!validation) {
      element?.classList.remove("input-error");
      label!.innerHTML = "";
    }
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
    const floatingLabel = element?.parentNode?.querySelector(
      "label.floating-label",
    );

    if (val && element) {
      element.classList.add("is-invalid");
      floatingLabel?.classList.replace(
        "float-label-black",
        "float-label-error",
      );
      label!.innerHTML = val.message;

      return 0;
    }

    element?.classList.remove("is-invalid");
    floatingLabel?.classList.replace("float-label-error", "float-label-black");
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

  if (show && data) {
    setValidation([]);
    setDisable(true);
    setLoading(false);
    setData(initialData(data));
    return modal.showModal();
  }

  if (show) {
    setValidation([]);
    setDisable(true);
    setLoading(false);
    setData(initialData());
    return modal.showModal();
  }

  return modal.close();
};

export const simpleModalHandler = (id: string, show: boolean) => {
  const modal = document.getElementById(id) as HTMLDialogElement;

  if (modal && show) {
    modal.showModal();
  } else if (modal && show == false) {
    modal.close();
  }
};

export const buttonCheck = (props: {
  data: PostDataTypes;
  requiredField: Array<string>;
  setDisable: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, requiredField, setDisable } = props;
  if (requiredField)
    for (let i = 0; i < requiredField.length; i++) {
      const field = requiredField[i];
      if (!(data as any)[field]) {
        setDisable(true);
        break;
      }

      setDisable(false);
    }
};

export const btnCheckExp = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  props: {
    requiredField: Array<string>;
    setDisable: Dispatch<SetStateAction<boolean>>;
  },
) => {
  const { requiredField, setDisable } = props;
  const { name, value } = event.target;
  const field = requiredField.find((req) => req == name);
  if (field) {
    if (!value) {
      return setDisable(true);
    }

    return setDisable(false);
  }
  for (let i = 0; i < requiredField.length; i++) {
    const sameField = requiredField[i] == name;
    if (sameField && !value) {
      setDisable(true);
      break;
    }

    if (sameField && value) setDisable(false);
  }
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
