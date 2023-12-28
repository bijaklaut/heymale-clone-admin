import type { Metadata } from "next";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "../../../components/Sidebar/Sidebar";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Heymale Clone",
  description: "Heymale Clone Project by Bijaklaut",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row">
      <Sidebar />

      <Suspense fallback={<Loading />}>
        <main
          data-theme={"dracula"}
          className="ms-[17rem] min-h-screen w-full p-10"
        >
          {children}
        </main>
      </Suspense>
      <ToastContainer enableMultiContainer containerId={"Main"} theme="dark" />
    </section>
  );
}
