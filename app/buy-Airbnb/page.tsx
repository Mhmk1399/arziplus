import AirbnbPaymentPage from "@/components/static/Airbnb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه Airbnb",
  description: "پرداخت هزینه Airbnb",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <AirbnbPaymentPage />
    </main>
  );
};

export default RegisterInternationalExams;
