import MalaysianSimCard from "@/components/static/MalaysianSimCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سیمکارت مالزی",
  description: "سیمکارت مالزی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <MalaysianSimCard />
    </main>
  );
};

export default RegisterInternationalExams;
