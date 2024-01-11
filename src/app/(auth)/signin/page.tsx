"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "../../../../services/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import heymaleLogo from "@/../public/images/logo/heymale-logo.png";

const Signin = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [validation, setValidation] = useState({
    email: {
      message: "",
    },
    password: {
      message: "",
    },
  });

  const submitHandler = async () => {
    const loading = toast.loading("Processing..", {
      containerId: "Main",
    });

    try {
      const result = await signIn(data);
      if (result.payload) {
        toast.update(loading, {
          render: result.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          containerId: "Main",
        });
        Cookies.set("token", btoa(result.payload), { expires: 1 });
        router.push("/");
      }
    } catch (error: any) {
      console.log("ERROR: ", error);
      if (error.status == 401) {
        toast.dismiss(loading);
        setValidation(error.errorDetail);
      } else {
        toast.update(loading, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          containerId: "Main",
        });
      }
    }
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <div
        data-theme="nord"
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
          <span className="invalid-feedback">
            {validation.email?.message ? validation.email?.message : ""}
          </span>
        </div>
        <div className="relative my-4 w-[300px]">
          <input
            id="pass"
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
          <label htmlFor="pass" className="floating-label">
            Password
          </label>
          <span className="invalid-feedback">
            {validation.password?.message ? validation.password?.message : ""}
          </span>
        </div>
        <div className="mt-10 flex w-full flex-col items-center">
          <button
            onClick={submitHandler}
            className="btn btn-outline btn-sm rounded-md px-5"
          >
            Sign in
          </button>
        </div>
      </div>
    </section>
  );
};

export default Signin;
