import ContactPage from "@/components/static/ContactPage";
import React from "react";
import { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "  ارتباط ما",
  description: "  ارتباط ما",
};
const page = () => {
  return (
    <div>
      <ContactPage />
    </div>
  );
};

export default page;
