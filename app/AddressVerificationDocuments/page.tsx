import AddressVerificationDocuments from "@/components/static/AddressVerificationDocuments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدارک تایید آدرس | قبض و پرینت حساب بانکی",
  description: "مدارک تایید آدرس | قبض و پرینت حساب بانکی",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <AddressVerificationDocuments />
    </main>
  );
};

export default RegisterInternationalExams;
