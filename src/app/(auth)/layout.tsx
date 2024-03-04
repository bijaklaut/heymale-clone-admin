import type { Metadata } from "next";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Heymale Clone | Sign-in",
  description: "Heymale Clone Project by Bijaklaut",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section data-theme={"dracula"} className="h-screen">
      <main>{children}</main>
      <ToastContainer
        hideProgressBar
        enableMultiContainer
        containerId={"Signin"}
        theme="dark"
      />
    </section>
  );
}
