import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "nolhandjiv03@yahoo.com"; // Email admin

serve(async (req) => {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dahomey Boy Contact <noreply@dahomeyboy.maxiimarket.com>",
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `[Contact] ${subject || "Nouveau message"}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1a1a1a; color: #fff; padding: 20px; }
                .content { padding: 30px; background: #f9f9f9; }
                .info { background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #D4A574; }
                .message-box { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Nouveau message de contact</h2>
                </div>
                <div class="content">
                  <div class="info">
                    <p><strong>De :</strong> ${name}</p>
                    <p><strong>Email :</strong> ${email}</p>
                    <p><strong>Sujet :</strong> ${subject || "Non spécifié"}</p>
                    <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
                  </div>
                  <div class="message-box">
                    <h3>Message :</h3>
                    <p>${message.replace(/\n/g, "<br>")}</p>
                  </div>
                  <p><em>Répondez directement à cet email pour contacter ${name}</em></p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
