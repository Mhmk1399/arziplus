import ToeflPayment from "@/components/static/tofelPay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "   پرداخت هزینه آزمون TOEFL | تسویه سریع و امن با ارزی پلاس",
  description: " پرداخت هزینه آزمون TOEFL",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <ToeflPayment />
    </main>
  );
};

export default RegisterInternationalExams;
