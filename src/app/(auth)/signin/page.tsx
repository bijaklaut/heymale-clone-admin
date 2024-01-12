"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    setValidation([]);
    try {
      const result = await signIn(data);

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message, { containerId: "Main" });
        Cookies.set("token", btoa(result.payload), { expires: 1 });
        router.push("/");
      }, 700);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
        if (error.status == 401) {
          return populateValidation(error, setValidation);
        }

        toast.error(error.message, { containerId: "Main" });
      }, 700);
    }
  };

  useEffect(() => {
    buttonCheck(data, ["email", "password"], setDisable);
  }, [data]);

  useEffect(() => {
    populateErrorFloating(validation, data);
  }, [validation]);

  return (
    <section className="flex h-screen items-center justify-center">
      <div
        data-theme="skies"
        className="mx-auto mb-8 flex w-full max-w-[700px] flex-col items-center rounded-xl bg-white px-5 py-8 transition-all duration-300 sm:px-10"
      >
        <Image
          className="mx-auto my-3 w-16 sm:w-32 lg:w-48"
          width={150}
          src={heymaleLogo}
          alt="heymale-logo"
        />
        <h2 className="mb-5 mt-3 text-center text-xl font-semibold text-black md:mb-8">
          Administrator Sign-in
        </h2>

        <div className="relative my-4 w-[300px]">
          <input
            id="email"
            autoComplete="off"
            placeholder="email"
            type="email"
            className="mini-input peer"
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
          />
          <label htmlFor="email" className="floating-label">
            Email
          </label>
          <span className="invalid-feedback"></span>
        </div>
        <div className="relative my-4 w-[300px]">
          <input
            id="password"
            placeholder="password"
            autoComplete="off"
            type="password"
            className="mini-input peer shadow-transparent"
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
          />
          <label htmlFor="password" className="floating-label">
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
