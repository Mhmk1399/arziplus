 import PrometricPayment from "@/components/static/prometricPayment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پرداخت هزینه آزمون پرومتریک   ویژه کادر درمان",
  description: "پرداخت هزینه آزمون پرومتریک   ویژه کادر درمان",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <PrometricPayment />
    </main>
  );
};

export default RegisterInternationalExams;
