// Email utility functions for ARZIPLUS
// This is a placeholder implementation - you should integrate with your preferred email service

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // TODO: Implement actual email sending logic
  // You can use services like:
  // - Nodemailer with SMTP
  // - SendGrid
  // - Amazon SES
  // - Mailgun
  // - Resend
  
  console.log("Sending email:", options);
  
  // For now, just simulate email sending
  if (process.env.NODE_ENV === "development") {
    console.log(`
      📧 EMAIL SENT (Development Mode)
      To: ${options.to}
      Subject: ${options.subject}
      Body: ${options.html || options.text}
    `);
    return Promise.resolve();
  }

  // In production, you would implement actual email sending here
  throw new Error("Email service not configured. Please implement sendEmail function in /lib/email.ts");
};

// Helper function to generate email templates
export const generateVerificationEmail = (code: string, userFirstName?: string): string => {
  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; font-size: 28px; margin: 0;">آرزی پلاس</h1>
          <p style="color: #6B7280; margin-top: 5px;">سامانه خدمات بین‌المللی</p>
        </div>
        
        <h2 style="color: #1F2937; text-align: center; margin-bottom: 20px;">تایید آدرس ایمیل</h2>
        
        ${userFirstName ? `<p style="color: #374151; font-size: 16px;">سلام ${userFirstName} عزیز،</p>` : '<p style="color: #374151; font-size: 16px;">سلام،</p>'}
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          برای تکمیل فرآیند تایید ایمیل خود، لطفاً کد زیر را در سامانه وارد کنید:
        </p>
        
        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center; border-radius: 12px; margin: 30px 0;">
          <div style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: 'Courier New', monospace;">
            ${code}
          </div>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">
            ⚠️ این کد تا 15 دقیقه دیگر معتبر است و تنها یک بار قابل استفاده می‌باشد.
          </p>
        </div>
        
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
          اگر شما درخواست تایید ایمیل نداده‌اید، لطفاً این پیام را نادیده بگیرید یا با پشتیبانی ما تماس بگیرید.
        </p>
        
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            با تشکر،<br>
            تیم فنی آرزی پلاس
          </p>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 10px;">
            این ایمیل به صورت خودکار ارسال شده است، لطفاً پاسخ ندهید.
          </p>
        </div>
      </div>
    </div>
  `;
};

// Helper function for welcome emails
export const generateWelcomeEmail = (userFirstName: string): string => {
  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; font-size: 28px; margin: 0;">آرزی پلاس</h1>
          <p style="color: #6B7280; margin-top: 5px;">سامانه خدمات بین‌المللی</p>
        </div>
        
        <h2 style="color: #1F2937; text-align: center; margin-bottom: 20px;">خوش آمدید! 🎉</h2>
        
        <p style="color: #374151; font-size: 16px;">سلام ${userFirstName} عزیز،</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          به خانواده آرزی پلاس خوش آمدید! ایمیل شما با موفقیت تایید شد و اکنون می‌توانید از تمامی خدمات ما استفاده کنید.
        </p>
        
        <div style="background: #EFF6FF; border: 1px solid #3B82F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1E40AF; margin: 0 0 10px 0;">خدمات در دسترس شما:</h3>
          <ul style="color: #1E40AF; margin: 0; padding-right: 20px;">
            <li>پرداخت هزینه‌های بین‌المللی</li>
            <li>خرید اشتراک سرویس‌های خارجی</li>
            <li>تهیه سیم‌کارت بین‌المللی</li>
            <li>پرداخت هزینه سفارت‌ها</li>
            <li>و خدمات متنوع دیگر...</li>
          </ul>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          برای شروع، توصیه می‌کنیم پروفایل خود را تکمیل کنید تا بتوانید از تمامی امکانات سامانه بهره‌مند شوید.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://arziplus.com'}/complete-profile" 
             style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            تکمیل پروفایل
          </a>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            اگر سوالی دارید، با ما در تماس باشید:<br>
            پشتیبانی: support@arziplus.com
          </p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 10px;">
            با تشکر،<br>
            تیم آرزی پلاس
          </p>
        </div>
      </div>
    </div>
  `;
};