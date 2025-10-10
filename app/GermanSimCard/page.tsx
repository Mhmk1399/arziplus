import GermanSimCard from "@/components/static/GermanSimCard";
 import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سیمکارت آلمان",
  description: "سیمکارت آلمان",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <GermanSimCard />
    </main>
  );
};

export default RegisterInternationalExams;
