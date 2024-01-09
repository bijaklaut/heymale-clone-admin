"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createAddress, updateAddress } from "../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AddressTypes, PostAddressTypes } from "../../../services/types";
import Cookies from "js-cookie";
import cx from "classnames";
import TextInput from "../../Form/TextInput";
import { getCity, getProvince } from "../../../services/actions";

interface thisProps {
  id: string;
  modalShow: boolean;
  showUpdate: boolean;
  address: AddressTypes;
  reset(): void;
}

const initialState = (id: string, address?: AddressTypes) => {
  if (address)
    return {
      addressLabel: address.addressLabel,
      recipientName: address.recipientName,
      address: address.address,
      province: { id: address.province.id, name: address.province.name },
      city: { id: address.city.id, name: address.city.name },
      postcode: address.postcode,
      phone: address.phone,
      user: address.user,
      asDefault: address.asDefault,
    };

  return {
    addressLabel: "",
    recipientName: "",
    address: "",
    province: { id: "", name: "" },
    city: { id: "", name: "" },
    postcode: "",
    phone: "",
    user: id ? id : "",
    asDefault: false,
  };
};

const PostAddressCollapse = (props: thisProps) => {
  const { id: userid, modalShow, showUpdate, address, reset } = props;
  const router = useRouter();
  const [provincesData, setProvincesData] = useState([{}]);
  const [citiesData, setCitiesData] = useState([{}]);
  const [showCollapse, setShowCollapse] = useState(false);
  const [disable, setDisable] = useState(true);
  const [validation, setValidation] = useState([
    {
      field: "",
      message: "",
    },
  ]);
  const [data, setData] = useState<PostAddressTypes>(initialState(userid));
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const classItem = cx({
    "origin-top rounded-md w-full bg-gray-700 px-10 py-5 duration-300 transition-all":
      true,
    "scale-y-0 -mb-5 opacity-0 h-0": !showCollapse,
    "scale-y-100 mb-5 opacity-100": showCollapse,
  });

  const buttonCheck = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!event.target.value) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const textInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputLabel: string,
  ) => {
    setData({
      ...data,
      [inputLabel]: event.target.value,
    });
    buttonCheck(event);
  };

  const collapseHandler = (
    isShow: boolean,
    userid: string,
    address?: AddressTypes,
  ) => {
    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

    if (isShow && address) {
      setDisable(true);
      setData(initialState(userid, address));
      setIsUpdate(true);
      setIsDefault(address.asDefault);

      return setShowCollapse(true);
    }

    if (isShow) {
      setDisable(true);
      setData(initialState(userid));

      return setShowCollapse(true);
    }

    reset();
    setIsUpdate(false);
    return setShowCollapse(false);
  };

  const submitHandler = async (userid: any) => {
    const form = new FormData();
    const loading = toast.loading("Processing..", {
      containerId: "AddressList",
    });

    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

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

    try {
      const token = Cookies.get("token");
      const result = await createAddress(form, token!);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "AddressList",
        });

        collapseHandler(false, userid);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error" || error.code == 11000) {
        toast.dismiss(loading);
        toast.error(error.message, { containerId: "AddressList" });
        for (const [key] of Object.entries(error.errorDetail)) {
          setValidation((prev) => [
            ...prev,
            {
              field: key,
              message: error.errorDetail[key].message,
            },
          ]);
        }
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "AddressList",
        });
      }
    }
  };

  const updateHandler = async (userid: string) => {
    const form = new FormData();
    const loading = toast.loading("Processing..", {
      containerId: "AddressList",
    });

    setValidation([
      {
        field: "",
        message: "",
      },
    ]);

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

    try {
      const token = Cookies.get("token");
      const result = await updateAddress(form, address._id, token!);

      if (result.payload) {
        toast.dismiss(loading);
        toast.success(result.message, {
          containerId: "AddressList",
        });

        collapseHandler(false, userid);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message == "Validation Error" || error.code == 11000) {
        toast.dismiss(loading);
        toast.error(error.message, { containerId: "AddressList" });
        for (const [key] of Object.entries(error.errorDetail)) {
          setValidation((prev) => [
            ...prev,
            {
              field: key,
              message: error.errorDetail[key].message,
            },
          ]);
        }
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "AddressList",
        });
      }
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

    if (data.province.id !== "") getCityAPI();
  }, [data.province]);

  // Auto close when modal closed
  useEffect(() => {
    if (modalShow == false) return collapseHandler(false, userid);
  }, [modalShow]);

  // Update Trigger
  useEffect(() => {
    if (showUpdate) {
      reset();
      return collapseHandler(true, userid, address);
    }
  }, [showUpdate]);

  return (
    <>
      <div className="relative mt-5 bg-transparent transition-all">
        <button
          className="btn btn-neutral btn-sm mb-3 w-fit rounded-md p-0 px-8 text-white"
          onClick={() => {
            collapseHandler(!showCollapse, userid);
          }}
        >
          {showCollapse ? "Close" : "Add Address"}
        </button>
        <div className={classItem}>
          {/* Address Label */}
          <TextInput
            label={["Address Label", "addressLabel", "e.g. Home, Gary's House"]}
            onChange={textInputHandler}
            validation={validation}
            data={data}
          />
          {/* Recipient Name */}
          <TextInput
            label={["Recipient's Name", "recipientName", "e.g. Gary Hopkins"]}
            onChange={textInputHandler}
            validation={validation}
            data={data}
          />

          {/* Address */}
          <label className="form-control">
            <div className="label">
              <span className="label-text -ms-1 text-white">Address</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24 p-2"
              placeholder="Enter full address"
              onChange={(e) => textInputHandler(e, "address")}
              spellCheck={false}
              value={data.address}
            ></textarea>
            <div className="label">
              {validation.map((val, i) =>
                val.field == "address" ? (
                  <span key={i} className="label-text-alt text-red-600">
                    {val.message}
                  </span>
                ) : (
                  ""
                ),
              )}
            </div>
          </label>

          {/* Province & City */}
          <div className="flex justify-between">
            {/* Province */}
            <label className="form-control w-[250px] max-w-xs">
              <div className="label">
                <span className="label-text -ms-1 text-white">Province</span>
              </div>
              <select
                className="select select-bordered"
                onChange={(e) => {
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
                  });
                }}
                value={data.province ? data.province.id : ""}
              >
                <option disabled value={""}>
                  Select Province
                </option>
                {provincesData.map((province: any, i: number) => {
                  return (
                    <option key={i} value={province.province_id}>
                      {province.province}
                    </option>
                  );
                })}
              </select>
              <div className="label">
                {validation.map((val, i) =>
                  val.field == "province.id" ? (
                    <span key={i} className="label-text-alt text-red-600">
                      {val.message}
                    </span>
                  ) : (
                    ""
                  ),
                )}
              </div>
            </label>

            {/* City */}
            <label className="form-control w-[250px] max-w-xs">
              <div className="label">
                <span className="label-text -ms-1 text-white">City</span>
              </div>

              <select
                className="select select-bordered"
                onChange={(e) => {
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
                  });
                }}
                value={data.city ? data.city.id : ""}
              >
                <option disabled value={""}>
                  Select City
                </option>
                {citiesData.map((city: any, i: number) => {
                  return (
                    <option key={i} value={city.city_id}>
                      {city.city_name}
                    </option>
                  );
                })}
              </select>

              <div className="label">
                {validation.map((val, i) =>
                  val.field == "city.id" ? (
                    <span key={i} className="label-text-alt text-red-600">
                      {val.message}
                    </span>
                  ) : (
                    ""
                  ),
                )}
              </div>
            </label>
          </div>

          {/* Postal Code & Phone Number*/}
          <div className="flex justify-between gap-x-6">
            {/* Postal Code */}
            <TextInput
              label={["Postal Code", "postcode", "e.g. 14045"]}
              onChange={textInputHandler}
              validation={validation}
              data={data}
            />

            {/* Phone Number */}
            <TextInput
              label={["Phone Number", "phone", "e.g. 0859xxxxxxx"]}
              onChange={textInputHandler}
              validation={validation}
              data={data}
            />
          </div>

          {/* As Default */}
          {isDefault ? (
            <div className="form-control w-52">
              <label className="label flex cursor-not-allowed justify-start gap-x-5">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="checkbox-accent checkbox checkbox-sm border-white"
                />
                <span className="label-text ms-0 text-white opacity-30">
                  Set as default address
                </span>
              </label>
            </div>
          ) : (
            <div className="form-control w-52">
              <label className="label flex cursor-pointer justify-start gap-x-5">
                <input
                  type="checkbox"
                  checked={data.asDefault}
                  onChange={(e) =>
                    setData({
                      ...data,
                      asDefault: e.target.checked ? true : false,
                    })
                  }
                  className="checkbox-accent checkbox checkbox-sm border-white"
                />
                <span className="label-text ms-0 text-white">
                  Set as default address
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => {
                if (isUpdate) return updateHandler(userid);
                submitHandler(userid);
              }}
              disabled={disable}
              className="btn btn-accent btn-sm text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostAddressCollapse;
