import AboutPage from "@/components/static/AboutPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "  درباره ما",
  description: "  درباره ما",
};
const page = () => {
  return (
    <div>
      <AboutPage />
    </div>
  );
};

export default page;
