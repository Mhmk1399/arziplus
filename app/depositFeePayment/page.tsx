 import DepositFeePayment from "@/components/static/depositFeePayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت دیپازیت فی",
  description: "پرداخت دیپازیت فی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <DepositFeePayment />
    </main>
  );
};

export default RegisterInternationalExams;
