export interface EmailDispatchResult {
  success: boolean;
  message: string;
  payload?: any;
}

export const emailService = {
  sendEmail: async (params: {
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
  }): Promise<EmailDispatchResult> => {
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await res.json().catch(() => null);

      // Record in local email log for candidate transparency
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("candidate_email_notifications") || "[]";
          const list = JSON.parse(raw);
          list.unshift({
            id: `email-${Date.now()}`,
            to: params.to,
            subject: params.subject,
            type: params.type,
            sentAt: new Date().toISOString(),
            details: {
              jobTitle: params.jobTitle,
              companyName: params.companyName,
              newStage: params.newStage,
            },
          });
          localStorage.setItem("candidate_email_notifications", JSON.stringify(list.slice(0, 50)));
          window.dispatchEvent(new CustomEvent("candidate_email_sent", { detail: params }));
        } catch {}
      }

      if (res.ok && data?.success !== false) {
        return {
          success: true,
          message: data?.message || "Email notification dispatched successfully.",
          payload: data?.payload,
        };
      }

      return {
        success: false,
        message: data?.message || "Failed to dispatch email notification.",
      };
    } catch (err: any) {
      console.warn("emailService.sendEmail error:", err);
      return {
        success: false,
        message: err?.message || "Network error while sending notification email.",
      };
    }
  },

  sendPasswordChangedEmail: async (email: string, candidateName?: string) => {
    return emailService.sendEmail({
      to: email,
      subject: "Security Notification: Password Changed",
      type: "password_changed",
      candidateName: candidateName || "Candidate",
    });
  },

  sendApplicationSubmittedEmail: async (data: {
    email: string;
    candidateName?: string;
    jobTitle: string;
    companyName: string;
    expectedCtc?: string;
    noticePeriod?: string;
  }) => {
    return emailService.sendEmail({
      to: data.email,
      subject: `Application Confirmed: ${data.jobTitle} at ${data.companyName}`,
      type: "application_submitted",
      candidateName: data.candidateName || "Candidate",
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      expectedCtc: data.expectedCtc,
      noticePeriod: data.noticePeriod,
    });
  },

  sendStageChangedEmail: async (data: {
    email: string;
    candidateName?: string;
    jobTitle: string;
    companyName: string;
    oldStage: string;
    newStage: string;
    statusNote?: string;
    applicationId?: string;
  }) => {
    return emailService.sendEmail({
      to: data.email,
      subject: `Application Status Update: ${data.jobTitle} (${data.newStage})`,
      type: "stage_changed",
      candidateName: data.candidateName || "Candidate",
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      oldStage: data.oldStage,
      newStage: data.newStage,
      statusNote: data.statusNote,
      applicationId: data.applicationId,
    });
  },
};

