declare module 'smsir-js' {
  export class Smsir {
    constructor(apiKey: string, lineNumber: number);
    SendVerifyCode(phone: string, templateId: number, parameters: Array<{ name: string; value: string }>): Promise<{
      data?: {
        status: number;
      };
    }>;
  }
}