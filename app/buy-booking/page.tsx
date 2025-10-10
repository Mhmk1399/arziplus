import BookingPaymentPage from "@/components/static/booking";
 import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه booking",
  description: "پرداخت هزینه booking",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <BookingPaymentPage />
    </main>
  );
};

export default RegisterInternationalExams;
