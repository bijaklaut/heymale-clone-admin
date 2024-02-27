"use client";

import { useCallback, useEffect, useState } from "react";
import { createAddress, updateAddress } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  AddressTypes,
  AreaDataTypes,
  PostAddressTypes,
  ValidationTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import cx from "classnames";
import TextInput from "../../Form/TextInput";
import { getArea } from "../../../services/actions";
import TextAreaInput from "../../Form/TextAreaInput";
import Checkbox from "./CheckboxDefault";
import { populateValidation } from "../../../services/helper";
import AreaSelect from "./AreaSelect";

interface thisProps {
  id: string;
  modalShow: boolean;
  showUpdate: boolean;
  address: AddressTypes;
  reset(): void;
  isFirst: boolean;
  stateChanges(): void;
}

const initData = (userId: string, address?: AddressTypes) => {
  return {
    addressLabel: address?.addressLabel || "",
    recipientName: address?.recipientName || "",
    address: address?.address || "",
    addressNote: address?.addressNote || "",
    addressArea: {
      areaId: address?.addressArea.areaId || "",
      province: address?.addressArea.province || "",
      city: address?.addressArea.city || "",
      district: address?.addressArea.district || "",
      postalCode: address?.addressArea.postalCode || "",
    },
    phone: address?.phone || "",
    user: address?.user || userId,
    asDefault: address?.asDefault || false,
  };
};

const PostAddressCollapse = (props: thisProps) => {
  const {
    id: userid,
    modalShow,
    showUpdate,
    address,
    reset,
    isFirst,
    stateChanges,
  } = props;
  const router = useRouter();
  const [data, setData] = useState<PostAddressTypes>(initData(userid));
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCollapse, setShowCollapse] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [areaData, setAreaData] = useState<AreaDataTypes[]>();

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const classItem = cx({
    "origin-top ease-linear rounded-md w-full px-4 sm:px-10 py-5 overflow-hidden duration-300 transition-all":
      true,
    "scale-y-0 -mb-5 opacity-0 absolute": !showCollapse,
    "scale-y-100 mb-5 opacity-100": showCollapse,
  });

  const centeredButton = cx({
    "w-full flex": true,
    "justify-center": isFirst,
  });

  const collapseHandler = useCallback(
    (isShow: boolean, userid: string, address?: AddressTypes) => {
      setValidation([]);
      setAreaSearch("");
      setDisable(true);

      if (isShow && address) {
        setData(initData(userid, address));
        setIsUpdate(true);
        setIsDefault(address.asDefault);

        return setShowCollapse(true);
      }

      if (isShow) {
        setData(initData(userid));
        setIsDefault(isFirst);

        return setShowCollapse(true);
      }

      setIsUpdate(false);
      return setShowCollapse(false);
    },
    [],
  );

  const selectAreaHandler = useCallback(
    (areaId: string) => {
      const selectedArea = areaData?.filter((area) => area.id == areaId)[0];

      if (selectedArea)
        setData((prev) => ({
          ...prev,
          addressArea: {
            areaId: selectedArea?.id,
            province: selectedArea?.administrative_division_level_1_name,
            city: selectedArea?.administrative_division_level_2_name,
            district: selectedArea?.administrative_division_level_3_name,
            postalCode: selectedArea?.postal_code,
          },
        }));
    },
    [data, areaData],
  );

  const getAreaAPI = useCallback(async () => {
    const result = await getArea(areaSearch);
    setAreaData(result.areas);
    setSearchLoading(false);
  }, [areaSearch]);

  const formAppend = useCallback(() => {
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key != "addressArea") {
        form.append(key, value);
      } else {
        for (const [k, v] of Object.entries(data[key])) {
          form.append(`${key}[${k}]`, v);
        }
      }
    }
    return form;
  }, [data]);

  const submitHandler = useCallback(
    async (userId: string) => {
      try {
        const form = formAppend();
        setLoading(true);
        setValidation([]);

        if (!isUpdate) {
          const token = Cookies.get("token");
          const result = await createAddress(form, token!);

          setTimeout(() => {
            setLoading(false);
            toast.success(result.message, { containerId: "Main" });
            collapseHandler(false, userid);
            router.refresh();
            stateChanges();
          }, 700);
        } else {
          const token = Cookies.get("token");
          const result = await updateAddress(form, address._id, token!);

          setTimeout(() => {
            setLoading(false);
            toast.success(result.message, { containerId: "Main" });
            collapseHandler(false, userid);
            router.refresh();
            stateChanges();
          }, 700);
        }
      } catch (error: any) {
        setTimeout(() => {
          setLoading(false);

          if (error.message == "Validation Error" || error.code == 11000) {
            return populateValidation(error, setValidation);
          }
          toast.error(error.message, { containerId: "AddressList" });
        }, 700);
      }
    },
    [isUpdate, data],
  );

  // Get Area
  useEffect(() => {
    setSearchLoading(true);
    let timer = setTimeout(() => {
      getAreaAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, [areaSearch]);

  // Auto close when modal closed
  useEffect(() => {
    if (modalShow == false) collapseHandler(false, userid);
  }, [modalShow]);

  // Update Trigger
  useEffect(() => {
    if (showUpdate) {
      reset();
      collapseHandler(true, userid, address);
    }
  }, [showUpdate]);

  // Button check
  useEffect(() => {
    const buttonCheck = () => {
      const reqField = [
        "addressLabel",
        "recipientName",
        "address",
        "addressArea",
        "phone",
      ];

      for (let i = 0; i < reqField.length; i++) {
        const field = reqField[i];

        if (field == "addressArea") {
          for (let j = 0; j < Object.entries(data.addressArea).length; j++) {
            const [key, value] = Object.entries(data.addressArea)[j];
            if (!value) {
              console.log(value);
              return setDisable(true);
            }
          }
        }

        if (!(data as any)[field] && field != "addressArea") {
          setDisable(true);
          break;
        }

        if ((data as any)[field] && field != "addressArea") {
          setDisable(false);
        }
      }
    };
    buttonCheck();
  }, [data]);

  return (
    <>
      <div className="relative mt-5 bg-transparent transition-all">
        <div className={centeredButton}>
          <button
            className={"btn btn-sm my-3 rounded-md"}
            data-theme={"skies"}
            onClick={() => {
              collapseHandler(!showCollapse, userid);
            }}
          >
            {showCollapse ? "Close" : "Add Address"}
          </button>
        </div>
        <div data-theme={"skies"} className={classItem}>
          {/* Address Label */}
          <TextInput
            dataState={{ data, setData }}
            label={["Address Label", "addressLabel", "e.g. Home, Gary's House"]}
            validations={validation}
          />
          {/* Recipient Name */}
          <TextInput
            dataState={{ data, setData }}
            label={["Recipient's Name", "recipientName", "e.g. Gary Hopkins"]}
            validations={validation}
          />

          {/* Phone Number */}
          <TextInput
            dataState={{ data, setData }}
            label={["Recipient's Phone", "phone", "e.g. 0859xxxxxxx"]}
            validations={validation}
          />

          {/* Address */}
          <TextAreaInput
            dataState={{ data, setData }}
            label={["Full Address", "address", "Enter full address"]}
            validations={validation}
          />
          <TextInput
            dataState={{ data, setData }}
            label={[
              "Address Note",
              "addressNote",
              "e.g. white house across circle k",
            ]}
            validations={validation}
          />
          <AreaSelect
            data={data}
            areaData={areaData}
            searchLabel={[
              "Address Area",
              "addressArea.Province",
              "Search city, district, or postal code",
            ]}
            searchHandler={(e) => setAreaSearch(e.target.value)}
            selectHandler={selectAreaHandler}
            searchLoading={searchLoading}
            validations={validation}
            value={areaSearch}
          />

          {/* As Default */}
          <Checkbox
            data={data}
            isDefault={isDefault}
            label={["Set as default address", "asDefault"]}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                asDefault: e.target.checked ? true : false,
              }))
            }
          />

          <div className="mt-5 flex justify-end">
            {!loading ? (
              <button
                onClick={() => submitHandler(userid)}
                disabled={disable}
                className="btn btn-primary btn-sm text-white"
              >
                {isUpdate ? "Update" : "Submit"}
              </button>
            ) : (
              <button className="btn btn-sm pointer-events-none">
                <span className="loading loading-spinner loading-sm"></span>
                {isUpdate ? "Updating.." : "Submitting.."}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostAddressCollapse;
