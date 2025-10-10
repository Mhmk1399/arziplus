import HostingerHostingPayment from "@/components/static/HostingerHostingPayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خرید هاست از Hostinger",
  description: "خرید هاست از Hostinger",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <HostingerHostingPayment />
    </main>
  );
};

export default RegisterInternationalExams;
