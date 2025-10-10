import AustraliaVisaPaymentPage from "@/components/static/australiaVisaPaymentPage ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه سفارت استرالیا",
  description: "پرداخت هزینه سفارت استرالیا",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <AustraliaVisaPaymentPage />
    </main>
  );
};

export default RegisterInternationalExams;
