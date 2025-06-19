const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    // For development, use Ethereal Email (fake SMTP) if no email config
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      await this.createTestAccount();
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Use real email service
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to any email service
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });
    } else {
      console.warn('⚠️  No email configuration found. Email sending will be disabled.');
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
      console.error('Failed to create test email account:', error.message);
    }
  }
  async sendVerificationCode(email, code, type = 'verification') {
    if (!this.transporter) {
      console.warn('⚠️  No email transporter available. Email sending skipped.');
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Dashboard App</h2>
          <h3>${subject}</h3>
          <p>Hello,</p>
          <p>${message}</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center;">
            <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 8px;">${code}</h2>
          </div>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>Dashboard Team</p>
        </div>
      `,
      text: `${subject}\n\n${message}\n\nVerification Code: ${code}\n\nIf you didn't request this code, please ignore this email.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Email preview URL:', previewUrl);
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send verification email');
    }
  }
  async sendWelcomeEmail(email, firstName) {
    if (!this.transporter) {
      console.warn('⚠️  No email transporter available. Welcome email skipped.');
      return { success: false };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@dashboard.com',
      to: email,
      subject: 'Welcome to Dashboard App!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Dashboard App!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for joining Dashboard App! Your email has been successfully verified.</p>
          <p>You can now access all features of our platform.</p>
          <p>Best regards,<br>Dashboard Team</p>
        </div>
      `,
      text: `Welcome to Dashboard App!\n\nHello ${firstName},\n\nThank you for joining Dashboard App! Your email has been successfully verified.\n\nYou can now access all features of our platform.\n\nBest regards,\nDashboard Team`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Welcome email sending failed:', error);
      // Don't throw error for welcome email as it's not critical
      return { success: false };
    }
  }
}

module.exports = new EmailService();
