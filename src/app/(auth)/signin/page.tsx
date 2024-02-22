"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { signIn } from "../../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import heymaleLogo from "@/../public/images/logo/heymale-logo.png";
import { SignInTypes, ValidationTypes } from "../../../../services/types";
import {
  buttonCheck,
  populateErrorFloating,
  populateValidation,
} from "../../../../services/helper";

const Signin = () => {
  const router = useRouter();
  const [data, setData] = useState<SignInTypes>({
    email: "",
    password: "",
  });
  const [validation, setValidation] = useState<ValidationTypes[]>([]);
  const [disable, setDisable] = useState(true);
  const [logged, setLogged] = useState("");
  const [loading, setLoading] = useState(false);
  const btnCheckProps = {
    data,
    requiredField: ["email", "password"],
    setDisable,
  };

  const submitHandler = useCallback(async () => {
    setLoading(true);
    setValidation([]);
    try {
      const result = await signIn(data);

      setTimeout(() => {
        setLoading(false);
        Cookies.set("token", btoa(result.payload), {
          expires: 1,
          sameSite: "strict",
        });

        toast.success(result.message, { containerId: "Main" });
        router.push("/");
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.status == 401) {
          return populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "Signin" });
      }, 700);
    }
  }, [data]);

  useEffect(() => {
    populateErrorFloating(validation, data);
  }, [validation]);

  useEffect(() => {
    buttonCheck(btnCheckProps);
  }, [data]);

  return (
    <section className="flex h-screen items-center justify-center px-5">
      <div
        data-theme="skies"
        className="mx-auto mb-8 flex w-full max-w-[400px] flex-col items-center rounded-xl bg-white px-5 py-8 shadow-md transition-all duration-300 sm:px-10 md:max-w-[550px]"
      >
        <Image
          className="mx-auto my-3 w-[150px] xl:w-[180px]"
          width={500}
          src={heymaleLogo}
          alt="heymale-logo"
        />
        <h2 className="mb-5 mt-3 text-center text-xl font-semibold text-black md:mb-8">
          Administrator Sign-in
        </h2>

        <div className="relative my-4 w-full max-w-[275px] sm:max-w-[300px]">
          <input
            id="email"
            autoComplete="off"
            placeholder="email"
            type="email"
            className="mini-input peer"
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <label htmlFor="email" className="floating-label float-label-black">
            Email
          </label>
          <span className="invalid-feedback"></span>
        </div>
        <div className="relative my-4 w-full max-w-[275px] sm:max-w-[300px]">
          <input
            id="password"
            placeholder="password"
            autoComplete="off"
            type="password"
            className="mini-input peer shadow-transparent"
            onChange={(e) =>
              setData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <label
            htmlFor="password"
            className="floating-label float-label-black"
          >
            Password
          </label>
          <span className="invalid-feedback"></span>
        </div>
        <div className="mt-10 flex w-full flex-col items-center">
          {!loading ? (
            <button
              onClick={submitHandler}
              disabled={disable}
              className="outline-base btn btn-outline btn-sm "
            >
              Sign in
            </button>
          ) : (
            <button className="btn btn-sm pointer-events-none">
              <span className="loading loading-spinner loading-sm"></span>
              Signing..
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Signin;
