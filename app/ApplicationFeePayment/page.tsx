import ApplicationFeePayment from "@/components/static/ApplicationFeePayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت اپلیکیشن فی",
  description: "پرداخت دیپازیت فی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <ApplicationFeePayment />
    </main>
  );
};

export default RegisterInternationalExams;
