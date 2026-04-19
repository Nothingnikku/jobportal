import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmailJsService {
  // Replace with your EmailJS values
  private readonly serviceId = 'service_4cxua4e';
  private readonly verificationTemplateId = 'template_79w3o9p';
  private readonly resetTemplateId = 'template_r9bnoli';
  private readonly publicKey = 'FpWRPDJFC0Wsr2Elm';

  async sendVerification(email: string, code: string): Promise<string> {
    const payload = {
      service_id: this.serviceId,
      template_id: this.verificationTemplateId,
      user_id: this.publicKey,
      template_params: {
        to_email: email,
        to_name: email,
        reply_to: email,
        email,
        user_email: email,
        code,
        otp: code,
        verification_code: code,
        verificationCode: code,
        passcode: code,
        time: new Date().toLocaleString(),
        company_name: 'SkillBridge',
        message: `Your SkillBridge verification code is ${code}`
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'EmailJS request failed');
    }
    return text || 'OK';
  }

  async sendResetLink(email: string, link: string): Promise<string> {
    const payload = {
      service_id: this.serviceId,
      template_id: this.resetTemplateId,
      user_id: this.publicKey,
      template_params: {
        to_email: email,
        to_name: email,
        reply_to: email,
        email,
        user_email: email,
        link,
        company_name: 'SkillBridge',
        message: `Reset your SkillBridge password here: ${link}`
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'EmailJS request failed');
    }
    return text || 'OK';
  }
}
