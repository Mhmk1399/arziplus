 import UniversityTuitionPayment from "@/components/static/foreignUniversity";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت شهریه دانشگاه خارجی",
  description: "پرداخت شهریه دانشگاه خارجی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <UniversityTuitionPayment />
    </main>
  );
};

export default RegisterInternationalExams;
