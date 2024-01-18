"use client";

import { useCallback, useEffect, useState } from "react";
import { createAddress, updateAddress } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  AddressTypes,
  PostAddressTypes,
  ValidationTypes,
} from "../../../services/types";
import Cookies from "js-cookie";
import cx from "classnames";
import TextInput from "../../Form/TextInput";
import { getCity, getProvince } from "../../../services/actions";
import TextAreaInput from "../../Form/TextAreaInput";
import SelectProvince from "./SelectProvince";
import SelectCity from "./SelectCity";
import Checkbox from "./CheckboxDefault";
import { populateValidation } from "../../../services/helper";

interface thisProps {
  id: string;
  modalShow: boolean;
  showUpdate: boolean;
  address: AddressTypes;
  reset(): void;
  centered?: boolean;
}

const initData = (id: string, address?: AddressTypes) => {
  return {
    addressLabel: address?.addressLabel || "",
    recipientName: address?.recipientName || "",
    address: address?.address || "",
    province: {
      id: address?.province.id || "",
      name: address?.province.name || "",
    },
    city: { id: address?.city.id || "", name: address?.city.name || "" },
    postcode: address?.postcode || "",
    phone: address?.phone || "",
    user: address?.user || id,
    asDefault: address?.asDefault || false,
  };
};

const PostAddressCollapse = (props: thisProps) => {
  const { id: userid, modalShow, showUpdate, address, reset, centered } = props;
  const router = useRouter();
  const [data, setData] = useState<PostAddressTypes>(initData(userid));
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showCollapse, setShowCollapse] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [isDefault, setIsDefault] = useState(false);
  const [provincesData, setProvincesData] = useState([{}]);
  const [citiesData, setCitiesData] = useState([{}]);

  const classItem = cx({
    "origin-top ease-linear rounded-md w-full px-10 py-5 overflow-hidden duration-300 transition-all":
      true,
    "scale-y-0 -mb-5 opacity-0 absolute": !showCollapse,
    "scale-y-100 mb-5 opacity-100": showCollapse,
  });

  const centeredButton = cx({
    "w-full flex": true,
    "justify-center": centered,
  });

  const collapseHandler = useCallback(
    (isShow: boolean, userid: string, address?: AddressTypes) => {
      setValidation([]);

      if (isShow && address) {
        setDisable(true);
        setData(initData(userid, address));
        setIsUpdate(true);
        setIsDefault(address.asDefault);

        return setShowCollapse(true);
      }

      if (isShow) {
        setDisable(true);
        setData(initData(userid));
        setIsDefault(false);

        return setShowCollapse(true);
      }

      reset();
      setIsUpdate(false);
      return setShowCollapse(false);
    },
    [],
  );

  const formAppend = useCallback(() => {
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key != "province" && key != "city") {
        form.append(key, value);
      }

      if (key == "province" || key == "city") {
        for (const [k, v] of Object.entries(data[key])) {
          form.append(`${key}[${k}]`, v);
        }
      }
    }
    return form;
  }, [data]);

  const submitHandler = async (userid: any) => {
    setLoading(true);
    setValidation([]);

    const form = formAppend();

    try {
      const token = Cookies.get("token");
      const result = await createAddress(form, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "AddressList" });
        collapseHandler(false, userid);
        router.refresh();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);

        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }
        toast.error(error.message, { containerId: "AddressList" });
      }, 700);
    }
  };

  const updateHandler = async (userid: string) => {
    setLoading(true);
    setValidation([]);

    const form = formAppend();

    try {
      const token = Cookies.get("token");
      const result = await updateAddress(form, address._id, token!);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "AddressList" });
        collapseHandler(false, userid);
        router.refresh();
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);

        if (error.message == "Validation Error" || error.code == 11000) {
          return populateValidation(error, setValidation);
        }
        toast.error(error.message, { containerId: "AddressList" });
      }, 700);
    }
  };

  // Get province
  useEffect(() => {
    const getProvinceAPI = async () => {
      const result = await getProvince();
      setProvincesData(result.rajaongkir.results);
    };
    getProvinceAPI();
  }, []);

  // Get city data
  useEffect(() => {
    const getCityAPI = async () => {
      const result = await getCity(data.province.id);
      setCitiesData(result.rajaongkir.results);
    };

    if (data.province.id) getCityAPI();
  }, [data.province]);

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
        "province",
        "city",
        "postcode",
        "phone",
      ];

      for (let i = 0; i < reqField.length; i++) {
        const field = reqField[i];

        if (field == "province" || field == "city") {
          if (!(data as any)[field]["id"]) {
            setDisable(true);
            break;
          }
          return setDisable(false);
        }

        if (!(data as any)[field]) {
          setDisable(true);
          break;
        }
        setDisable(false);
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

          {/* Address */}
          <TextAreaInput
            dataState={{ data, setData }}
            label={["Full Address", "address", "Enter full address"]}
            validations={validation}
          />

          {/* Province & City */}
          <div className="grid w-full grid-cols-2 items-center justify-between gap-x-5">
            {/* Province */}
            <SelectProvince
              data={data}
              onChange={(e) =>
                provincesData.map((pro: any) => {
                  if (pro.province_id == e.target.value) {
                    return setData({
                      ...data,
                      province: {
                        id: pro.province_id,
                        name: pro.province,
                      },
                      city: {
                        id: "",
                        name: "",
                      },
                    });
                  }
                })
              }
              provincesData={provincesData}
              validations={validation}
            />
            {/* City */}
            <SelectCity
              data={data}
              onChange={(e) =>
                citiesData.map((cit: any) => {
                  if (cit.city_id == e.target.value) {
                    return setData({
                      ...data,
                      city: {
                        id: cit.city_id,
                        name: cit.city_name,
                      },
                    });
                  }
                })
              }
              citiesData={citiesData}
              validations={validation}
            />
          </div>

          {/* Postal Code & Phone Number*/}
          <div className="grid grid-cols-2 gap-x-5">
            {/* Postal Code */}
            <TextInput
              dataState={{ data, setData }}
              label={["Postal Code", "postcode", "e.g. 14045"]}
              validations={validation}
            />

            {/* Phone Number */}
            <TextInput
              dataState={{ data, setData }}
              label={["Phone Number", "phone", "e.g. 0859xxxxxxx"]}
              validations={validation}
            />
          </div>

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
                onClick={() => {
                  if (isUpdate) return updateHandler(userid);
                  submitHandler(userid);
                }}
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
