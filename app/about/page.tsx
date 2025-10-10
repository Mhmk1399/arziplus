import AboutPage from "@/components/static/AboutPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "صفحه درباره ما",
  description: "صفحه درباره ما",
};
const page = () => {
  return (
    <div>
      <AboutPage />
    </div>
  );
};

export default page;
