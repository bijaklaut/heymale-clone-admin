import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  DataTypes,
  FilterTypes,
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

export const singleButtonCheck = (
  event: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setDisable: Dispatch<SetStateAction<boolean>>,
) => {
  if (!event.target.value) return setDisable(true);
  setDisable(false);
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

export const textInputHandler = (
  value: string | number,
  label: string,
  setData: Dispatch<SetStateAction<any>>,
) => {
  setData((prev: any) => ({
    ...prev,
    [label]: value,
  }));
};

export const numInputHandler = (
  value: string | number,
  label: string,
  setData: Dispatch<SetStateAction<any>>,
) => {
  setData((prev: any) => ({
    ...prev,
    [label]: Number(value),
  }));
};

export const variantHandler = (
  value: string | number,
  label: string,
  setState: Dispatch<SetStateAction<any>>,
) => {
  setState((prev: any) => ({
    ...prev,
    variant: {
      ...prev.variant,
      [label]: Number(value),
    },
  }));
};

export const initPagination = (payload?: any) => {
  return {
    docs: payload?.docs || [],
    page: payload?.page || 1,
    totalPages: payload?.totalPages || 1,
    pagingCounter: payload?.pagingCounter || 1,
    hasPrevPage: payload?.hasPrevPage || false,
    hasNextPage: payload?.hasNextPage || false,
    prevPage: payload?.prevPage || null,
    nextPage: payload?.nextPage || null,
  };
};

export const initCriteria = (data: DataTypes[], filterField: string) => {
  let returnValue: FilterTypes[] = [];

  data.map((d) => {
    return returnValue.push({ name: (d as any)[filterField], include: true });
  });

  return returnValue;
};

export const queryGenerator = (filters: FilterTypes[]) => {
  let joinArray: string[] = [];
  filters
    .filter((crit) => crit.include)
    .map((crit) => joinArray.push(crit.name));

  return `((^)(${joinArray.join("|")}))+$` || "";
};

export const pageHandler = (
  pageNumber: number,
  setPage: Dispatch<SetStateAction<number>>,
) => setPage(pageNumber);

export const stateChanges = (setChanges: Dispatch<SetStateAction<boolean>>) =>
  setChanges((prev) => !prev);
