import UpworkAccountCreation from "@/components/static/Upwork";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افتتاح حساب آپورک",
  description: "افتتاح حساب آپورک",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <UpworkAccountCreation />
    </main>
  );
};

export default RegisterInternationalExams;
