 import USVisaPaymentPage from "@/components/static/americanEmbassy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه سفارت آمریکا",
  description: "پرداخت هزینه سفارت آمریکا",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <USVisaPaymentPage />
    </main>
  );
};

export default RegisterInternationalExams;
