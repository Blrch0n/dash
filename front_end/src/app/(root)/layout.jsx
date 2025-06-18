"use client";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SiderBar from "./components/SiderBar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RootLayout({ children }) {
  return (
    <ProtectedRoute>
      <section className="flex h-screen w-full">
        <SiderBar />
        <div className="w-full h-full flex flex-col">
          <Header />
          <main className="w-full h-full"> {children}</main>
          <Footer />
        </div>
      </section>
    </ProtectedRoute>
  );
}
