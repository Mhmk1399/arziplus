import UKVisaPaymentPage from "@/components/static/UKVisaPaymentPage ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه سفارت انگلیس",
  description: "پرداخت هزینه سفارت انگلیس",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <UKVisaPaymentPage />
    </main>
  );
};

export default RegisterInternationalExams;
