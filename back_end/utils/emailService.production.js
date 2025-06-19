const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    if (process.env.NODE_ENV === 'production') {
      await this.createProductionTransporter();
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await this.createDevelopmentTransporter();
    } else {
      await this.createTestAccount();
    }
  }

  async createProductionTransporter() {
    try {
      // Production email service configuration
      const emailConfig = this.getProductionEmailConfig();
      
      this.transporter = nodemailer.createTransport(emailConfig);
      
      // Verify connection
      await this.transporter.verify();
      console.log('✅ Production email service connected successfully');
      
    } catch (error) {
      console.error('❌ Production email service failed:', error.message);
      throw new Error('Failed to initialize production email service');
    }
  }

  getProductionEmailConfig() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('EMAIL_USER and EMAIL_PASS must be set in production');
    }

    // Detect email service provider
    if (emailUser.includes('@gmail.com')) {
      return {
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      };
    }

    // SendGrid
    if (emailUser === 'apikey' || process.env.SENDGRID_API_KEY) {
      return {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY || emailPass
        }
      };
    }

    // Amazon SES
    if (emailUser.includes('amazonaws.com') || process.env.AWS_SES_REGION) {
      return {
        host: `email-smtp.${process.env.AWS_SES_REGION || 'us-east-1'}.amazonaws.com`,
        port: 587,
        secure: false,
        auth: { user: emailUser, pass: emailPass }
      };
    }

    // Mailgun
    if (process.env.MAILGUN_DOMAIN) {
      return {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: { user: emailUser, pass: emailPass }
      };
    }

    // Generic SMTP
    return {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: emailUser, pass: emailPass }
    };
  }

  async createDevelopmentTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await this.transporter.verify();
      console.log('📧 Development email service connected');
    } catch (error) {
      console.error('⚠️ Development email service failed, falling back to test account');
      await this.createTestAccount();
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Using test email account:', testAccount.user);
      console.log('📬 Email preview available at: https://ethereal.email');
    } catch (error) {
      console.error('❌ Failed to create test email account:', error.message);
    }
  }

  async sendVerificationCode(email, code, type = 'verification') {
    if (!this.transporter) {
      console.warn('⚠️ No email transporter available. Email sending skipped.');
      throw new Error('Email service not configured');
    }

    const subject = type === 'verification' 
      ? 'Email Verification Code' 
      : 'Login Verification Code';
    
    const message = type === 'verification'
      ? `Your email verification code is: ${code}. This code will expire in 10 minutes.`
      : `Your login verification code is: ${code}. This code will expire in 5 minutes.`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@dashboard.com',
      to: email,
      subject: subject,
      html: this.getEmailTemplate(subject, message, code),
      text: `${subject}\n\n${message}\n\nVerification Code: ${code}\n\nIf you didn't request this code, please ignore this email.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl && process.env.NODE_ENV !== 'production') {
        console.log('📧 Email preview URL:', previewUrl);
      }

      // Log successful email sending in production
      if (process.env.NODE_ENV === 'production') {
        console.log(`✅ Email sent successfully to ${email} (${info.messageId})`);
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: process.env.NODE_ENV !== 'production' ? previewUrl : undefined,
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send verification email');
    }
  }

  getEmailTemplate(subject, message, code) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Dashboard App</h1>
                    <h2 style="color: #007bff; margin: 0 0 20px 0; font-size: 20px;">${subject}</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">Hello,</p>
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">${message}</p>
                    
                    <div style="background-color: #f8f9fa; padding: 30px; margin: 20px 0; text-align: center; border-radius: 6px; border: 2px dashed #007bff;">
                      <div style="color: #007bff; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</div>
                    </div>
                    
                    <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">If you didn't request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 16px; margin: 0;">Best regards,<br><strong>Dashboard Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email, firstName) {
    if (!this.transporter) {
      console.warn('⚠️ No email transporter available. Welcome email skipped.');
      return { success: false };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@dashboard.com',
      to: email,
      subject: 'Welcome to Dashboard App!',
      html: this.getWelcomeEmailTemplate(firstName),
      text: `Welcome to Dashboard App!\n\nHello ${firstName},\n\nThank you for joining Dashboard App! Your email has been successfully verified.\n\nYou can now access all features of our platform.\n\nBest regards,\nDashboard Team`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'production') {
        console.log(`✅ Welcome email sent to ${email} (${info.messageId})`);
      }
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Welcome email sending failed:', error);
      return { success: false };
    }
  }

  getWelcomeEmailTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Dashboard App!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="color: #28a745; margin: 0 0 20px 0; font-size: 28px;">🎉 Welcome to Dashboard App!</h1>
                    <p style="color: #666; font-size: 18px; line-height: 1.5; margin: 0 0 20px 0;">Hello <strong>${firstName}</strong>,</p>
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">Thank you for joining Dashboard App! Your email has been successfully verified and your account is now active.</p>
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">You can now access all features of our platform and start building amazing dashboards.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="background-color: #28a745; color: white; padding: 15px 30px; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">Account Verified ✓</div>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 16px; margin: 0;">Best regards,<br><strong>Dashboard Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
