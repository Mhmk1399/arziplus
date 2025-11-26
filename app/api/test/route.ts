import { verifyNationalCodeWithMobile } from "@/lib/nationalValidataion";

export async function GET() {
  const phoneNumber = "09015528276";
  const nationalNumber = "0440814073";

  const result = await verifyNationalCodeWithMobile(
    nationalNumber,
    phoneNumber
  );
  return new Response(JSON.stringify({ result }));
}
