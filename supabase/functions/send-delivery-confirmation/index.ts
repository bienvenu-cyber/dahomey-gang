import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DeliveryConfirmationRequest {
  to: string;
  customerName: string;
  orderNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DeliveryConfirmationRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #0f1729; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0f1729 0%, #1a2744 100%); color: #ffd700; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; background: #fff; text-align: center; }
          .success-icon { font-size: 64px; margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; background: #ffd700; color: #0f1729; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; }
          .btn-outline { background: transparent; border: 2px solid #0f1729; color: #0f1729; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DAHOMEY-GANG</h1>
            <p style="margin: 10px 0 0; color: #fff;">Commande livrée !</p>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <h2>Félicitations ${data.customerName} !</h2>
            <p>Votre commande <strong>${data.orderNumber}</strong> a été livrée avec succès.</p>
            
            <p style="margin: 30px 0;">Nous espérons que vous êtes satisfait(e) de vos achats !</p>
            
            <p>N'hésitez pas à partager vos looks sur les réseaux sociaux avec le hashtag <strong>#DahomeyGang</strong></p>
            
            <div style="margin-top: 30px;">
              <a href="https://dahomey-gang.com/shop" class="btn">Continuer le shopping</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 14px; color: #666;">
              Un problème avec votre commande ? <a href="mailto:contact@dahomey-gang.com" style="color: #0f1729;">Contactez-nous</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Dahomey-Gang. Tous droits réservés.</p>
            <p>Un partenaire de <a href="https://kamextrading.com" style="color: #0f1729;">KamexTrading</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Dahomey-Gang <noreply@dahomey-gang.com>",
      to: [data.to],
      subject: `Votre commande ${data.orderNumber} a été livrée ! 🎉`,
      html: emailHtml,
    });

    console.log("Delivery confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending delivery confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
