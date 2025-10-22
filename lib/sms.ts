import { Smsir } from 'smsir-js';

export async function sendVerificationCode(phone: string, code: string) {
  try {
    const smsir = new Smsir(process.env.SMS_IR_API_KEY!, parseInt(process.env.SMS_IR_LINE_NUMBER!));
    const result = await smsir.SendVerifyCode(phone, parseInt(process.env.SMS_IR_TEMPLATE_ID!), [{ name: 'CODE', value: code }]);
    return result.data?.status === 1;
  } catch (error: unknown) {
    console.log('SMS send error:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function sendOrderConfirmationSMS(phone: string, customerName: string, orderId: string) {
  try {
    const smsir = new Smsir(process.env.SMS_IR_API_KEY!, parseInt(process.env.SMS_IR_LINE_NUMBER!));
    const templateId = parseInt(process.env.SERVICE_SMS!);
    
    // Truncate customer name to max 20 characters
    const truncatedName = customerName.length > 20 ? customerName.substring(0, 20) : customerName;
    
    // Generate shorter order ID (max 20 characters)
    const shortOrderId = generateShortOrderId(orderId);
    
    const result = await smsir.SendVerifyCode(phone, templateId, [
      { name: 'CustomerName', value: truncatedName },
      { name: 'ORDERID', value: shortOrderId }
    ]);
    
    console.log('SMS send result:', result);
    return result.data?.status === 1;
  } catch (error: unknown) {
    console.log('Order SMS send error:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export function generateShortOrderId(fullOrderId: string): string {
  // Extract timestamp from order ID (e.g., "SERVICE-WALLET-1729693200000" or "HOZORI-1729693200000")
  const timestampMatch = fullOrderId.match(/\d{13}/);
  
  if (timestampMatch) {
    // Use last 10 digits of timestamp
    const timestamp = timestampMatch[0].slice(-10);
    
    // Determine prefix based on order type
    let prefix = 'ORD';
    if (fullOrderId.includes('WALLET')) prefix = 'WAL';
    else if (fullOrderId.includes('HOZORI')) prefix = 'HOZ';
    else if (fullOrderId.includes('SERVICE')) prefix = 'SRV';
    else if (fullOrderId.includes('LOTTERY')) prefix = 'LOT';
    
    // Format: PREFIX-TIMESTAMP (e.g., "SRV-9693200000" = 14 chars max)
    return `${prefix}-${timestamp}`;
  }
  
  // Fallback: use last 15 characters of order ID
  return fullOrderId.slice(-15);
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}