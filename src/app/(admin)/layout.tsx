import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "../../../components/Sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Heymale Clone",
  description: "Heymale Clone Project by Hudaa Eka Saputra",
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
        className="mt-[70px] min-h-screen w-full px-3 pb-5 pt-10 sm:ms-[4.5rem] sm:mt-0 lg:ms-0 lg:px-10 lg:py-10 xl:px-20"
      >
        {children}
      </main>
    </section>
  );
}
