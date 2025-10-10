import InternationalSimRecharge from "@/components/static/InternationalSimRecharge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شارژ سیم‌کارت بین‌المللی – ارزی پلاس",
  description: "شارژ سیم‌کارت بین‌المللی – ارزی پلاس",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <InternationalSimRecharge />
    </main>
  );
};

export default RegisterInternationalExams;
