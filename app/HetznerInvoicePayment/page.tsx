import HetznerInvoicePayment from "@/components/static/HetznerInvoicePayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت فاکتور هتزنر",
  description: "پرداخت فاکتور هتزنر",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <HetznerInvoicePayment />
    </main>
  );
};

export default RegisterInternationalExams;
