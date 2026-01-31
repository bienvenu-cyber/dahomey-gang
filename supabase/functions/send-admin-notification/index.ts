import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type NotificationType = "new_order" | "low_stock" | "new_customer" | "payment_received";

interface AdminNotificationRequest {
  type: NotificationType;
  adminEmail: string;
  data: Record<string, any>;
}

const getEmailContent = (type: NotificationType, data: Record<string, any>) => {
  switch (type) {
    case "new_order":
      return {
        subject: `🛒 Nouvelle commande ${data.orderNumber}`,
        html: `
          <h2>Nouvelle commande reçue !</h2>
          <p><strong>Numéro:</strong> ${data.orderNumber}</p>
          <p><strong>Client:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Total:</strong> ${data.total}</p>
          <p><strong>Articles:</strong> ${data.itemCount}</p>
          <p><a href="${data.adminUrl}" style="background: #ffd700; color: #0f1729; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir la commande</a></p>
        `,
      };
    case "low_stock":
      return {
        subject: `⚠️ Stock faible: ${data.productName}`,
        html: `
          <h2>Alerte stock faible</h2>
          <p><strong>Produit:</strong> ${data.productName}</p>
          <p><strong>Stock actuel:</strong> ${data.currentStock} unités</p>
          <p><strong>Seuil d'alerte:</strong> ${data.threshold} unités</p>
          <p><a href="${data.adminUrl}" style="background: #ffd700; color: #0f1729; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gérer le stock</a></p>
        `,
      };
    case "new_customer":
      return {
        subject: `👤 Nouveau client inscrit`,
        html: `
          <h2>Nouveau client</h2>
          <p><strong>Nom:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
        `,
      };
    case "payment_received":
      return {
        subject: `💰 Paiement reçu - ${data.orderNumber}`,
        html: `
          <h2>Paiement confirmé</h2>
          <p><strong>Commande:</strong> ${data.orderNumber}</p>
          <p><strong>Montant:</strong> ${data.amount}</p>
          <p><strong>Méthode:</strong> ${data.paymentMethod}</p>
          <p><a href="${data.adminUrl}" style="background: #ffd700; color: #0f1729; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Traiter la commande</a></p>
        `,
      };
    default:
      return {
        subject: "Notification Dahomey-Gang",
        html: `<p>Notification reçue</p>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, adminEmail, data }: AdminNotificationRequest = await req.json();

    const { subject, html } = getEmailContent(type, data);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #0f1729; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: #0f1729; color: #ffd700; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; }
          .content { padding: 30px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 DAHOMEY-GANG Admin</h1>
          </div>
          <div class="content">
            ${html}
          </div>
          <div class="footer">
            <p>Notification automatique du système Dahomey-Gang</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Dahomey-Gang Admin <admin@dahomey-gang.com>",
      to: [adminEmail],
      subject,
      html: emailHtml,
    });

    console.log("Admin notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
