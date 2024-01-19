import type { Metadata } from "next";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "../../../components/Sidebar/Sidebar";

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

      <main
        data-theme={"skies"}
        className="mt-[50px] min-h-screen w-full px-3 py-8 pb-5 sm:ms-[4.5rem] sm:mt-0 lg:ms-0 lg:px-10 lg:py-10"
      >
        {children}
      </main>
      <ToastContainer enableMultiContainer containerId={"Main"} theme="dark" />
    </section>
  );
}
