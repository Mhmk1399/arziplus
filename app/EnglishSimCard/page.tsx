import EnglishSimCard from "@/components/static/EnglishSimCard";
  import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سیمکارت انگلیس",
  description: "سیمکارت انگلیس",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <EnglishSimCard />
    </main>
  );
};

export default RegisterInternationalExams;
