import DIDPage from "@/components/static/D-ID";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خرید اکانت D-ID",
  description: "خرید اکانت D-ID",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <DIDPage />
    </main>
  );
};

export default RegisterInternationalExams;
