import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
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
        from: "Dahomey Boy <noreply@dahomeyboy.maxiimarket.com>",
        to: [email],
        subject: "Bienvenue dans le Gang ! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1a1a1a; color: #fff; padding: 30px; text-align: center; }
                .brand { font-size: 28px; font-weight: bold; color: #D4A574; }
                .content { padding: 30px; background: #f9f9f9; }
                .cta { display: inline-block; padding: 12px 30px; background: #D4A574; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="brand">DAHOMEY-GANG</div>
                  <p>Streetwear Premium</p>
                </div>
                <div class="content">
                  <h2>Bienvenue dans le Gang ! 🎉</h2>
                  <p>Merci de vous être inscrit à notre newsletter !</p>
                  <p>Vous recevrez en exclusivité :</p>
                  <ul>
                    <li>🎁 10% de réduction sur votre première commande</li>
                    <li>🔥 Les nouvelles collections en avant-première</li>
                    <li>💎 Des offres exclusives réservées aux membres</li>
                    <li>📦 Des codes promo réguliers</li>
                  </ul>
                  <p>Utilisez le code <strong>WELCOME10</strong> pour profiter de votre réduction dès maintenant !</p>
                  <center>
                    <a href="https://dahomeyboy.maxiimarket.com/shop" class="cta">Découvrir la boutique</a>
                  </center>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Dahomey-Gang. Tous droits réservés.</p>
                  <p>Cotonou, Bénin</p>
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
