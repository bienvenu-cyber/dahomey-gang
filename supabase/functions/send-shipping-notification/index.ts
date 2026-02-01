import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ShippingNotificationRequest {
  to: string;
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ShippingNotificationRequest = await req.json();

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
          .content { padding: 30px; background: #fff; }
          .tracking-box { background: #f8f8f8; border: 2px dashed #ffd700; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #0f1729; letter-spacing: 2px; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; background: #ffd700; color: #0f1729; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 DAHOMEY-GANG</h1>
            <p style="margin: 10px 0 0; color: #fff;">Votre commande est en route !</p>
          </div>
          <div class="content">
            <p>Bonjour ${data.customerName},</p>
            <p>Bonne nouvelle ! Votre commande <strong>${data.orderNumber}</strong> vient d'être expédiée.</p>
            
            ${data.trackingNumber ? `
              <div class="tracking-box">
                <p style="margin: 0 0 10px; color: #666;">Numéro de suivi</p>
                <div class="tracking-number">${data.trackingNumber}</div>
                ${data.carrier ? `<p style="margin: 10px 0 0; color: #666;">Transporteur: ${data.carrier}</p>` : ""}
              </div>
            ` : ""}
            
            ${data.estimatedDelivery ? `
              <p style="text-align: center; font-size: 18px;">
                📅 Livraison estimée: <strong>${data.estimatedDelivery}</strong>
              </p>
            ` : ""}
            
            <p style="margin-top: 30px;">Vous pouvez suivre l'évolution de votre colis en utilisant le numéro de suivi ci-dessus.</p>
            
            <p>À très bientôt chez <strong>Dahomey-Gang</strong> !</p>
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
      from: "Dahomey Boy <noreply@dahomeyboy.maxiimarket.com>",
      to: [data.to],
      subject: `Votre commande ${data.orderNumber} est en route ! 🚚`,
      html: emailHtml,
    });

    console.log("Shipping notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending shipping notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
