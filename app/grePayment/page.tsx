   import GrePayment from "@/components/static/grePayent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "   پرداخت هزینه آزمون Gre | تسویه سریع و امن با ارزی پلاس",
  description: " پرداخت هزینه آزمون Gre",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <GrePayment />
    </main>
  );
};

export default RegisterInternationalExams;
