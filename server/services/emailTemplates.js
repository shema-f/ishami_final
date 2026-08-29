import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ISHAMI app logo (favicon) embedded as base64 so emails always show the logo
// even without internet-hosted assets.
const FALLBACK_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="90" fill="#dc2626"/><path d="M96 40c-30 0-52 22-52 52v40c0 14 11 25 25 25h54c14 0 25-11 25-25V92c0-30-22-52-52-52z" fill="#ffffff"/><circle cx="76" cy="104" r="8" fill="#0f172a"/><circle cx="116" cy="104" r="8" fill="#0f172a"/><path d="M96 76l20 20-20 20-20-20z" fill="#10b981"/></svg>`;

// The ISHAMI logo is the app favicon set (same design the app shows in its
// header/footer as "ISHAMI Logo"). We use apple-touch-icon.png — the
// high-res version of the favicon.
const LOGO_FILE = "apple-touch-icon.png";
const LOGO_CID = "ishami-logo";

// Gmail and most email clients BLOCK base64 data-URI images, so the logo is
// sent as a real image attachment referenced by Content-ID (cid:) instead.
function loadLogo() {
  try {
    const logoPath = path.resolve(__dirname, "..", "..", "src", "favicon_io", LOGO_FILE);
    return { content: fs.readFileSync(logoPath), contentType: "image/png" };
  } catch {
    return { content: Buffer.from(FALLBACK_LOGO_SVG), contentType: "image/svg+xml" };
  }
}

const LOGO = loadLogo();

// Nodemailer attachment that makes cid:ishami-logo render in the email.
// Pass as `attachments: [logoAttachment()]` on every sendMail call.
export function logoAttachment() {
  return { filename: "ishami-logo.png", content: LOGO.content, contentType: LOGO.contentType, cid: LOGO_CID };
}

const BRAND = {
  name: "ISHAMI",
  tagline: "AMATEGEKO Y'UMUHANDA",
  dark: "#0f172a",
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  green: "#10b981",
  text: "#374151",
  heading: "#111827",
  muted: "#94a3b8",
  bg: "#f1f5f9",
  white: "#ffffff"
};

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function button(href, label, color = BRAND.primary) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto"><tr><td style="border-radius:10px;background:${color}"><a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.3px">${escapeHtml(label)}</a></td></tr></table>`;
}

function layout({ title, preheader, bodyHtml, footerExtra = "" }) {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BRAND.bg}">${escapeHtml(preheader || "")}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.bg};padding:24px 12px">
<tr><td align="center">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.08)">
    <!-- Header -->
    <tr><td style="background:${BRAND.dark};padding:28px 24px;text-align:center">
      <img src="cid:${LOGO_CID}" alt="${BRAND.name} logo" width="72" height="72" style="display:block;margin:0 auto 10px;border-radius:14px;border:2px solid rgba(255,255,255,0.15)"/>
      <div style="font-size:24px;font-weight:800;color:${BRAND.white};letter-spacing:4px">ISHAMI</div>
      <div style="font-size:11px;color:#94a3b8;letter-spacing:2.5px;margin-top:3px">${BRAND.tagline}</div>
    </td></tr>
    <!-- Body -->
    <tr><td style="padding:32px 36px;color:${BRAND.text};font-size:15px;line-height:1.7">
      ${bodyHtml}
    </td></tr>
    <!-- Footer -->
    <tr><td style="background:${BRAND.dark};padding:24px;text-align:center">
      <div style="font-size:14px;color:#cbd5e1;font-weight:600">#GerayoAmahoro 🇷🇼</div>
      <div style="margin:12px 0">
        <a href="https://facebook.com/ishami.rw" style="display:inline-block;margin:0 6px;text-decoration:none"><img src="https://img.icons8.com/fluency/24/facebook-new.png" alt="Facebook" width="24" height="24" style="border-radius:4px"/></a>
        <a href="https://twitter.com/ishami_rw" style="display:inline-block;margin:0 6px;text-decoration:none"><img src="https://img.icons8.com/fluency/24/twitter.png" alt="Twitter" width="24" height="24" style="border-radius:4px"/></a>
        <a href="https://instagram.com/ishami.rw" style="display:inline-block;margin:0 6px;text-decoration:none"><img src="https://img.icons8.com/fluency/24/instagram-new.png" alt="Instagram" width="24" height="24" style="border-radius:4px"/></a>
        <a href="https://linkedin.com/company/ishami" style="display:inline-block;margin:0 6px;text-decoration:none"><img src="https://img.icons8.com/fluency/24/linkedin.png" alt="LinkedIn" width="24" height="24" style="border-radius:4px"/></a>
        <a href="https://youtube.com/@ishami" style="display:inline-block;margin:0 6px;text-decoration:none"><img src="https://img.icons8.com/fluency/24/youtube-play.png" alt="YouTube" width="24" height="24" style="border-radius:4px"/></a>
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:8px">© ${year} ${BRAND.name} — Master Rwanda Traffic Rules.<br/>Kigali, Rwanda</div>
      <div style="font-size:11px;color:#475569;margin-top:10px;padding-top:10px;border-top:1px solid #334155">Powered by <a href="https://ferrivox.com" style="color:#60a5fa;text-decoration:none;font-weight:600">Ferrivox Ltd</a> · <a href="https://ishami.rw" style="color:#60a5fa;text-decoration:none">ishami.rw</a></div>
      ${footerExtra}
    </td></tr>
  </table>
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin:14px 0 0">This is an automated message from ${BRAND.name}. Do not reply to this email.</p>
</td></tr>
</table>
</body>
</html>`;
}

export function welcomeEmail({ username = "Mugenzi", appUrl = "https://ishami.rw" } = {}) {
  const bodyHtml = `
    <div style="text-align:center;margin-bottom:22px">
      <div style="display:inline-block;background:#ecfdf5;color:#047857;font-size:13px;font-weight:700;border-radius:999px;padding:6px 16px">Murakaza neza · Welcome</div>
    </div>
    <h1 style="margin:0 0 6px;color:${BRAND.heading};font-size:22px">Welcome aboard, ${escapeHtml(username)}! 🎉</h1>
    <p style="margin:0 0 18px">Thank you for joining <strong>ISHAMI</strong>. You've taken the first step toward mastering Rwanda's traffic rules and acing your driving theory test.</p>
    <p style="margin:0 0 6px">What you can do now:</p>
    <ul style="margin:0 0 22px;padding-left:20px">
      <li style="margin-bottom:8px"><strong>Ask Moto-Sensei</strong> — your AI traffic instructor for signs, rules &amp; scenarios (Kinyarwanda + English).</li>
      <li style="margin-bottom:8px"><strong>Practice quizzes</strong> — real exam-style questions with instant explanations.</li>
      <li style="margin-bottom:8px"><strong>3D driving simulation</strong> — learn by driving in a virtual Rwanda city.</li>
    </ul>
    <div style="text-align:center;margin:26px 0 8px">${button(appUrl, "Start Learning", BRAND.green)}</div>
    <p style="font-size:13px;color:${BRAND.muted};text-align:center;margin:18px 0 0">Drive safely. Learn daily. <strong>#GerayoAmahoro</strong></p>
  `;
  return layout({ title: "Welcome to ISHAMI — Murakaza neza!", preheader: "You're one step closer to mastering Rwanda traffic rules.", bodyHtml });
}

export function resetPasswordEmail({ username = "Mugenzi", resetUrl = "", expiresHours = 1 } = {}) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;color:${BRAND.heading};font-size:22px">Password Reset Request 🔐</h1>
    <p style="margin:0 0 16px">Muraho ${escapeHtml(username)}, we received a request to reset your ISHAMI password. If this was you, click the button below to choose a new one:</p>
    <div style="text-align:center;margin:26px 0">${button(resetUrl, "Reset My Password")}</div>
    <p style="margin:0 0 8px;font-size:13px;color:${BRAND.muted}">Or copy and paste this link into your browser:</p>
    <p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Consolas,Menlo,monospace;font-size:12px;word-break:break-all;color:${BRAND.text}">${escapeHtml(resetUrl)}</p>
    <p style="margin:18px 0 0;font-size:12px;color:${BRAND.muted}">This link is valid for the next <strong>${expiresHours} hour${expiresHours === 1 ? "" : "s"}</strong>. If you didn't request this, you can safely ignore this email — your password won't change.</p>
  `;
  return layout({ title: "Reset your password — ISHAMI", preheader: "Use this link to set a new password for your ISHAMI account.", bodyHtml });
}

export function newsletterThanksEmail({ email = "", siteUrl = "https://ishami.rw" } = {}) {
  const bodyHtml = `
    <div style="text-align:center;margin-bottom:22px">
      <div style="display:inline-block;background:#ecfdf5;color:#047857;font-size:13px;font-weight:700;border-radius:999px;padding:6px 16px">Urakoze kwiyandikisha · Subscribed ✓</div>
    </div>
    <h1 style="margin:0 0 6px;color:${BRAND.heading};font-size:22px">Murakaza neza kuri ISHAMI!</h1>
    <p style="margin:0 0 16px">Urakoze kwiyandikisha ku makuru yacu. Tuzajya kugutumira amakuru agezweho ku <strong>mategeko y'umuhanda</strong>, inama zo gutsinda ikizamini cy'ubutumwa, n'ibindi byiza byose byo mu Rwanda.</p>
    <p style="margin:0 0 6px">Inama ngufi: <strong>Koresha neza umuhanda</strong> — umutekano ni ingambe. #GerayoAmahoro</p>
    <div style="text-align:center;margin:26px 0 8px">${button(siteUrl, "Sura urubuga", BRAND.green)}</div>
  `;
  return layout({
    title: "Welcome to ISHAMI newsletter!",
    preheader: "Urakoze kwiyandikisha — you're subscribed to ISHAMI traffic updates.",
    bodyHtml,
    footerExtra: `<div style="font-size:12px;color:#64748b;margin-top:10px">You received this because ${escapeHtml(email || "you")} subscribed to ISHAMI updates.<br/>To unsubscribe, reply with "STOP".</div>`
  });
}

export function paymentThankYouEmail({ username = "Mugenzi", amount = 0, product = "pro", appUrl = "https://ishami.rw" } = {}) {
  const productName = product === 'irembo' ? 'Irembo Driving License Application' : 'ISHAMI Pro Membership';
  const bodyHtml = `
    <div style="text-align:center;margin-bottom:22px">
      <div style="display:inline-block;background:#ecfdf5;color:#047857;font-size:13px;font-weight:700;border-radius:999px;padding:6px 16px">Murakoze · Thank You ✓</div>
    </div>
    <h1 style="margin:0 0 6px;color:${BRAND.heading};font-size:22px">Payment Confirmed! 🎉</h1>
    <p style="margin:0 0 16px">Muraho ${escapeHtml(username)}, thank you for your payment of <strong>${escapeHtml(String(amount))} RWF</strong> for <strong>${escapeHtml(productName)}</strong>.</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Product</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${BRAND.heading}">${escapeHtml(productName)}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Amount</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${BRAND.heading}">${escapeHtml(String(amount))} RWF</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Status</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${BRAND.green}">✓ Confirmed</td></tr>
      </table>
    </div>
    <p style="margin:0 0 6px">You now have full access to all premium features. If you have any questions, feel free to reach out to us at <a href="mailto:support@ishami.rw" style="color:${BRAND.primary}">support@ishami.rw</a>.</p>
    <div style="text-align:center;margin:26px 0 8px">${button(appUrl, "Go to ISHAMI", BRAND.green)}</div>
    <p style="font-size:13px;color:${BRAND.muted};text-align:center;margin:18px 0 0">Murakoze cyane! Drive safely. <strong>#GerayoAmahoro</strong></p>
  `;
  return layout({ title: "Payment Confirmed — ISHAMI", preheader: "Your payment has been confirmed. Thank you for supporting ISHAMI!", bodyHtml });
}

export function certificateEmail({ username = "Mugenzi", score = 0, totalQuestions = 0, certificateNo = "", issuedAt = "", appUrl = "https://ishami.rw" } = {}) {
  const percentage = Math.round(((score || 0) / Math.max(1, totalQuestions || 1)) * 100);
  const bodyHtml = `
    <div style="text-align:center;margin-bottom:22px">
      <div style="display:inline-block;background:#dbeafe;color:#1d4ed8;font-size:13px;font-weight:700;border-radius:999px;padding:6px 16px">🏆 Certificate Earned</div>
    </div>
    <h1 style="margin:0 0 6px;color:${BRAND.heading};font-size:22px">Congratulations, ${escapeHtml(username)}! 🎓</h1>
    <p style="margin:0 0 16px">You've earned your <strong>ISHAMI Traffic Rules Certificate</strong>! Your knowledge of Rwanda's traffic regulations has been officially recognized.</p>
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%);border-radius:12px;padding:24px;margin:20px 0;text-align:center;border:2px solid #334155">
      <div style="font-size:11px;color:#94a3b8;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">ISHAMI Certificate</div>
      <div style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:4px">Traffic Rules & Road Safety</div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:16px">Awarded to <strong style="color:#60a5fa">${escapeHtml(username)}</strong></div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="text-align:center;padding:8px;border-right:1px solid #334155"><div style="font-size:24px;font-weight:800;color:${BRAND.green}">${percentage}%</div><div style="font-size:11px;color:#94a3b8">Score</div></td>
          <td style="text-align:center;padding:8px;border-right:1px solid #334155"><div style="font-size:14px;font-weight:700;color:#60a5fa">${escapeHtml(String(score))}/${escapeHtml(String(totalQuestions))}</div><div style="font-size:11px;color:#94a3b8">Questions</div></td>
          <td style="text-align:center;padding:8px"><div style="font-size:12px;font-weight:600;color:#cbd5e1">${escapeHtml(certificateNo)}</div><div style="font-size:11px;color:#94a3b8">Certificate No.</div></td>
        </tr>
      </table>
      <div style="font-size:11px;color:#64748b;margin-top:12px">Issued: ${escapeHtml(issuedAt || new Date().toLocaleDateString())}</div>
    </div>
    <p style="margin:0 0 6px">You can view and download your certificate from your ISHAMI profile. Share your achievement and inspire others!</p>
    <div style="text-align:center;margin:26px 0 8px">${button(appUrl + "/certificate", "View Certificate", BRAND.primary)}</div>
    <p style="font-size:13px;color:${BRAND.muted};text-align:center;margin:18px 0 0">Keep learning, keep driving safely. <strong>#GerayoAmahoro</strong> 🇷🇼</p>
  `;
  return layout({ title: "Certificate Earned — ISHAMI", preheader: "Congratulations! You earned your ISHAMI Traffic Rules Certificate.", bodyHtml });
}
