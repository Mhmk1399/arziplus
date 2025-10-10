import EstonianSimCard from "@/components/static/EstonianSimCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سیمکارت استونی",
  description: "سیمکارت استونی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <EstonianSimCard />
    </main>
  );
};

export default RegisterInternationalExams;
