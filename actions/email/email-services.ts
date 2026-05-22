"use server";

import { sendEmail } from "./send-email";

export interface EmailResult {
  success: boolean;
  message: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function baseTemplate(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JOBGRID</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;letter-spacing:-0.08em;text-transform:uppercase;color:#0055c8;">
                    JOBGRID
                  </td>
                  <td align="right">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-block;border-radius:4px;background-color:#e7e8ea;padding:3px 8px;">
                      <tr>
                        <td style="font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#424655;">
                          SYSTEM_SECURE
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;border:1px solid #c2c6d8;padding:40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width:40px;height:4px;background-color:#0055c8;border-radius:2px;">
                      <tr><td style="font-size:1px;line-height:1px;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>
                ${body}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#727786;">
                ENCRYPTION: AES-256 &nbsp;|&nbsp; PROTOCOL_V4.2
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildVerificationEmailHtml(token: string): string {
  const link = `${APP_URL}/api/verify-email?token=${token}`;
  return baseTemplate(`
    <tr>
      <td style="padding-bottom:8px;">
        <h1 style="margin:0;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-0.04em;text-transform:uppercase;color:#191c1e;">
          Verify Your<br />Email Address
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.24em;color:#0055c8;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:#0055c8;vertical-align:middle;margin-right:6px;"></span>
          INITIALIZING_VERIFICATION...
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:16px;">
        <p style="margin:0;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#424655;">
          Thank you for registering with JOBGRID. To activate your account, please verify your email address by clicking the button below.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:16px;">
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#727786;">
          This link will expire in 1 hour.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:8px;background-color:#0055c8;box-shadow:0 0 24px rgba(30,115,255,0.28);">
              <a href="${link}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#ffffff;text-decoration:none;border-radius:8px;">
                VERIFY EMAIL
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <p style="margin:0;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.5;color:#727786;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="margin:6px 0 0;font-family:'JetBrains Mono',monospace;font-size:12px;color:#0055c8;word-break:break-all;">
          ${link}
        </p>
      </td>
    </tr>
  `);
}

function buildPasswordResetEmailHtml(token: string): string {
  const link = `${APP_URL}/reset-password?token=${token}`;
  return baseTemplate(`
    <tr>
      <td style="padding-bottom:8px;">
        <h1 style="margin:0;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-0.04em;text-transform:uppercase;color:#191c1e;">
          Reset Your<br />Access Key
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.24em;color:#0055c8;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:#0055c8;vertical-align:middle;margin-right:6px;"></span>
          INITIALIZING_KEY_RECOVERY...
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:16px;">
        <p style="margin:0;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#424655;">
          You requested a password reset for your JOBGRID account. Click the button below to create a new access key.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:16px;">
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#727786;">
          This link will expire in 1 hour.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:8px;background-color:#0055c8;box-shadow:0 0 24px rgba(30,115,255,0.28);">
              <a href="${link}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#ffffff;text-decoration:none;border-radius:8px;">
                RESET ACCESS KEY
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <p style="margin:0;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.5;color:#727786;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="margin:6px 0 0;font-family:'JetBrains Mono',monospace;font-size:12px;color:#0055c8;word-break:break-all;">
          ${link}
        </p>
      </td>
    </tr>
  `);
}

export async function getVerificationEmailHtml(token: string): Promise<string> {
  return buildVerificationEmailHtml(token);
}

export async function getPasswordResetEmailHtml(token: string): Promise<string> {
  return buildPasswordResetEmailHtml(token);
}



export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<EmailResult> {
  const html = await getVerificationEmailHtml(token);
  return sendEmail(email, "Verify your email address", html);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<EmailResult> {
  const html = await getPasswordResetEmailHtml(token);
  return sendEmail(email, "Reset your password", html);
}
