const TO_EMAIL = process.env.ENQUIRY_TO_EMAIL || "Enquiries@verodesignandbuild.co.uk";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Vero Website <website@verodesignandbuild.com>";

function safe(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  const { name, email, phone, postcode, projectType, budget, message, attachments = [] } = req.body || {};

  if (!name || !validEmail(email) || !phone || !postcode || !projectType || !message) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  if (!Array.isArray(attachments) || attachments.length > 2) {
    return res.status(400).json({ error: "A maximum of 2 attachments is allowed." });
  }

  const totalBytes = attachments.reduce((sum, a) => {
    const b64 = String(a?.content || "");
    return sum + Math.ceil((b64.length * 3) / 4);
  }, 0);

  if (totalBytes > 3 * 1024 * 1024) {
    return res.status(400).json({ error: "Attachments are too large. Keep the total under 3MB." });
  }

  const resendAttachments = attachments.map(a => ({
    filename: String(a.filename || "attachment"),
    content: String(a.content || "")
  }));

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#1b1b1b">
      <h2>New Vero website enquiry</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Phone:</strong> ${safe(phone)}</p>
      <p><strong>Postcode:</strong> ${safe(postcode)}</p>
      <p><strong>Project type:</strong> ${safe(projectType)}</p>
      <p><strong>Budget:</strong> ${safe(budget || "Not provided")}</p>
      <p><strong>Project details:</strong></p>
      <p>${safe(message).replace(/\n/g, "<br>")}</p>
      <hr>
      <p style="font-size:12px;color:#666">Submitted via verodesignandbuild.com. Reply to this email to respond directly to the enquirer.</p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: ["New Vero enquiry", projectType, postcode, name].filter(Boolean).join(" — "),
        html,
        attachments: resendAttachments
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(502).json({ error: "Your enquiry could not be delivered. Please call or WhatsApp 07581 240938." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Enquiry error:", error);
    return res.status(500).json({ error: "Your enquiry could not be delivered. Please call or WhatsApp 07581 240938." });
  }
}
