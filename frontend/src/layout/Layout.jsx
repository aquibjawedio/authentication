import Navbar from "@/features/shared/components/Navbar";
import FooterPage from "@/features/shared/pages/FooterPage";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <FooterPage />
    </>
  );
};

export default Layout;
