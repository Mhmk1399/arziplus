import UniAssistPayment from "@/components/static/UniAssistPayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه uni-assist",
  description: "پرداخت هزینه uni-assist",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <UniAssistPayment />
    </main>
  );
};

export default RegisterInternationalExams;
