import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EmailRequestBody {
  to: string;
  subject: string;
  type: "password_changed" | "stage_changed" | "application_submitted" | "general";
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
  oldStage?: string;
  newStage?: string;
  statusNote?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  applicationId?: string;
  html?: string;
}

function getBaseTemplate(title: string, badgeText: string, badgeBg: string, badgeColor: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 24px 12px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
    .header { background: #0f172a; padding: 32px 32px 24px; text-align: left; }
    .logo { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .content { padding: 32px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background-color: ${badgeBg}; color: ${badgeColor}; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px; line-height: 1.3; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-val { color: #0f172a; font-weight: 700; text-align: right; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; margin: 18px 0 8px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
    .footer a { color: #64748b; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Voctrum <span>Candidate Portal</span></div>
    </div>
    <div class="content">
      <div class="badge">${badgeText}</div>
      ${bodyContent}
    </div>
    <div class="footer">
      <p style="margin: 0 0 4px; font-size: 12px;">This is an automated notification from Voctrum Candidate Portal.</p>
      <p style="margin: 0; font-size: 11px;">If you have questions or suspect unauthorized activity, please contact support.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const body: EmailRequestBody = await request.json();
    const { to, subject, type, candidateName = "Candidate" } = body;

    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { success: false, message: "A valid recipient email address is required." },
        { status: 400 }
      );
    }

    let htmlBody = body.html || "";

    if (!htmlBody) {
      if (type === "password_changed") {
        const timestamp = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        const content = `
          <h1>Your Password Was Successfully Changed</h1>
          <p>Hello <strong>${candidateName}</strong>,</p>
          <p>We are confirming that the password for your Voctrum Candidate Portal account (<strong>${to}</strong>) was recently changed.</p>
          <div class="info-box">
            <div class="info-row"><span class="info-label">Account</span><span class="info-val">${to}</span></div>
            <div class="info-row"><span class="info-label">Date & Time</span><span class="info-val">${timestamp}</span></div>
            <div class="info-row"><span class="info-label">Status</span><span class="info-val" style="color: #16a34a;">Password Active</span></div>
          </div>
          <p style="color: #b91c1c; font-size: 13px; font-weight: 600;">
            Security Notice: If you did not make this change, please contact our support team immediately or reset your password to protect your account.
          </p>
        `;
        htmlBody = getBaseTemplate("Security Notice: Password Changed", "Security Update", "#fef3c7", "#92400e", content);
      } else if (type === "stage_changed") {
        const {
          jobTitle = "Role",
          companyName = "Employer",
          oldStage = "Under Review",
          newStage = "Shortlisted",
          statusNote = "Your application has progressed to the next recruitment milestone.",
          applicationId = "",
        } = body;

        const content = `
          <h1>Application Status Updated</h1>
          <p>Hello <strong>${candidateName}</strong>,</p>
          <p>There is an update on your job application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          <div class="info-box">
            <div class="info-row"><span class="info-label">Position</span><span class="info-val">${jobTitle}</span></div>
            <div class="info-row"><span class="info-label">Company</span><span class="info-val">${companyName}</span></div>
            <div class="info-row"><span class="info-label">Previous Stage</span><span class="info-val" style="color: #64748b;">${oldStage}</span></div>
            <div class="info-row"><span class="info-label">New Active Stage</span><span class="info-val" style="color: #2563eb;">${newStage}</span></div>
            ${applicationId ? `<div class="info-row"><span class="info-label">Reference ID</span><span class="info-val">${applicationId}</span></div>` : ""}
          </div>
          <p><strong>Recruiter Update:</strong></p>
          <p style="background: #eff6ff; border-left: 3px solid #2563eb; padding: 12px 14px; border-radius: 6px; font-size: 13px; color: #1e40af;">
            &ldquo;${statusNote}&rdquo;
          </p>
          <p>You can track complete recruitment timeline stages, interview schedules, and submission materials directly in your candidate dashboard.</p>
        `;
        htmlBody = getBaseTemplate(`Application Status: ${newStage}`, "Recruitment Milestone", "#dbeafe", "#1e40af", content);
      } else if (type === "application_submitted") {
        const {
          jobTitle = "Job Opportunity",
          companyName = "Hiring Company",
          expectedCtc = "",
          noticePeriod = "",
        } = body;

        const content = `
          <h1>Application Received & Confirmed</h1>
          <p>Hello <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. Your application has been successfully submitted and confirmed.</p>
          <div class="info-box">
            <div class="info-row"><span class="info-label">Job Title</span><span class="info-val">${jobTitle}</span></div>
            <div class="info-row"><span class="info-label">Company</span><span class="info-val">${companyName}</span></div>
            ${expectedCtc ? `<div class="info-row"><span class="info-label">Expected CTC</span><span class="info-val">${expectedCtc}</span></div>` : ""}
            ${noticePeriod ? `<div class="info-row"><span class="info-label">Notice Period</span><span class="info-val">${noticePeriod}</span></div>` : ""}
            <div class="info-row"><span class="info-label">Status</span><span class="info-val" style="color: #16a34a;">Submitted</span></div>
          </div>
          <p>The recruitment team will review your verified profile, resume, and qualifications. You will receive email notifications as your application advances through screening and interview stages.</p>
        `;
        htmlBody = getBaseTemplate("Application Submitted", "Application Confirmed", "#dcfce7", "#166534", content);
      } else {
        htmlBody = getBaseTemplate(subject, "Notification", "#eff6ff", "#1e40af", `<p>${subject}</p>`);
      }
    }

    // Configure Nodemailer transporter:
    // If SMTP environment variables exist, use them. Otherwise, use mock jsonTransport
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || '"Voctrum Candidate Portal" <notifications@voctrum.com>';

    let info: any;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html: htmlBody,
      });
    } else {
      // Fallback logger & transport
      const transporter = nodemailer.createTransport({
        jsonTransport: true,
      });

      info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html: htmlBody,
      });

      console.log(`[Email Dispatched] To: ${to} | Subject: "${subject}" | Type: ${type}`);
    }

    return NextResponse.json({
      success: true,
      message: `Notification email dispatched to ${to}.`,
      payload: {
        to,
        subject,
        type,
        messageId: info?.messageId || `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Email API Route error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to dispatch email notification.",
      },
      { status: 500 }
    );
  }
}

