 import IeltsPayment from "@/components/static/ietlsPay";
 import { Metadata } from "next";

export const metadata: Metadata = {
  title: "   پرداخت هزینه آزمون Ielts | تسویه سریع و امن با ارزی پلاس",
  description: " پرداخت هزینه آزمون Ielts",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <IeltsPayment />
    </main>
  );
};

export default RegisterInternationalExams;
