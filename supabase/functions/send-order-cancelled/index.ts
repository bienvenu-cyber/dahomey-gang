import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderCancelledRequest {
  to: string;
  customerName: string;
  orderNumber: string;
  reason?: string;
  refundInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderCancelledRequest = await req.json();

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
          .cancel-box { background: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; background: #ffd700; color: #0f1729; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DAHOMEY-GANG</h1>
            <p style="margin: 10px 0 0; color: #fff;">Commande annulée</p>
          </div>
          <div class="content">
            <p>Bonjour ${data.customerName},</p>
            
            <div class="cancel-box">
              <p style="margin: 0;"><strong>Votre commande ${data.orderNumber} a été annulée.</strong></p>
              ${data.reason ? `<p style="margin: 10px 0 0; color: #666;">Raison: ${data.reason}</p>` : ""}
            </div>
            
            ${data.refundInfo ? `
              <h3>Informations de remboursement</h3>
              <p>${data.refundInfo}</p>
            ` : ""}
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            
            <p style="margin-top: 30px;">Nous espérons vous revoir bientôt chez <strong>Dahomey-Gang</strong>.</p>
            
            <div style="text-align: center;">
              <a href="https://dahomeyboy.maxiimarket.com/shop" class="btn">Retourner à la boutique</a>
            </div>
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
      subject: `Commande ${data.orderNumber} annulée`,
      html: emailHtml,
    });

    console.log("Order cancelled email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order cancelled email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
