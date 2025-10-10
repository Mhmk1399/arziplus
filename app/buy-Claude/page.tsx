import ClaudeAIPage from "@/components/static/Claude";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اکانت Claude",
  description: "اکانت Claude",
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <ClaudeAIPage />
    </main>
  );
};

export default RegisterInternationalExams;
