import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  to: string;
  customerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WelcomeEmailRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #0f1729; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #0f1729 0%, #1a2744 100%); color: #ffd700; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 3px; }
          .content { padding: 40px 30px; background: #fff; }
          .highlight { background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%); color: #0f1729; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .features { margin: 30px 0; }
          .feature { display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #f8f8f8; border-radius: 8px; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .footer { background: #0f1729; color: #fff; padding: 30px; text-align: center; }
          .btn { display: inline-block; background: #ffd700; color: #0f1729; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
          .social-links { margin-top: 20px; }
          .social-links a { display: inline-block; margin: 0 10px; color: #ffd700; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DAHOMEY-GANG</h1>
            <p style="margin: 15px 0 0; color: #fff; font-size: 14px;">L'héritage royal du streetwear</p>
          </div>
          <div class="content">
            <h2 style="text-align: center; margin-bottom: 10px;">Bienvenue dans le Gang, ${data.customerName} ! 👑</h2>
            
            <div class="highlight">
              <p style="margin: 0; font-weight: bold; font-size: 18px;">Vous faites maintenant partie de la famille Dahomey-Gang !</p>
            </div>
            
            <p>Merci de nous avoir rejoint. En tant que membre du Gang, vous bénéficiez de :</p>
            
            <div class="features">
              <div class="feature">
                <span class="feature-icon">🎁</span>
                <div>
                  <strong>Offres exclusives</strong>
                  <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Accès en avant-première à nos nouvelles collections</p>
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">🚚</span>
                <div>
                  <strong>Livraison suivie</strong>
                  <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Suivez votre commande en temps réel</p>
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">💎</span>
                <div>
                  <strong>Qualité premium</strong>
                  <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Des vêtements conçus pour durer</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="https://dahomey-gang.com/shop" class="btn">Découvrir la collection</a>
            </div>
            
            <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #666;">
              Besoin d'aide ? Notre équipe est là pour vous.<br>
              <a href="mailto:contact@dahomey-gang.com" style="color: #0f1729;">contact@dahomey-gang.com</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px;">Suivez-nous sur les réseaux sociaux</p>
            <div class="social-links">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
            </div>
            <p style="margin: 20px 0 0; font-size: 12px; color: #888;">
              © ${new Date().getFullYear()} Dahomey-Gang. Tous droits réservés.
            </p>
            <p style="margin: 10px 0 0; font-size: 12px; color: #888;">
              Un partenaire de <a href="https://kamextrading.com" style="color: #ffd700;">KamexTrading</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Dahomey-Gang <noreply@dahomey-gang.com>",
      to: [data.to],
      subject: `Bienvenue dans le Gang, ${data.customerName} ! 👑`,
      html: emailHtml,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
