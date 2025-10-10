import JokerDomainPayment from "@/components/static/joker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خرید دامنه از جوکر",
  description: "خرید دامنه از جوکر",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <JokerDomainPayment />
    </main>
  );
};

export default RegisterInternationalExams;
