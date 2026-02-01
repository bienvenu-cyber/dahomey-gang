import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
}

interface OrderConfirmationRequest {
  to: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  currency: "EUR" | "XOF";
}

const formatPrice = (amount: number, currency: "EUR" | "XOF"): string => {
  if (currency === "XOF") {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount * 655.957)) + " FCFA";
  }
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderConfirmationRequest = await req.json();

    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.product_name}
          ${item.size ? `<br><small>Taille: ${item.size}</small>` : ""}
          ${item.color ? `<br><small>Couleur: ${item.color}</small>` : ""}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.unit_price, data.currency)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.total_price, data.currency)}</td>
      </tr>
    `).join("");

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
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background: #0f1729; color: #ffd700; padding: 12px; text-align: left; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { padding: 8px 0; }
          .grand-total { font-size: 18px; font-weight: bold; color: #0f1729; border-top: 2px solid #ffd700; padding-top: 12px; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; background: #ffd700; color: #0f1729; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DAHOMEY-GANG</h1>
            <p style="margin: 10px 0 0; color: #fff;">Confirmation de commande</p>
          </div>
          <div class="content">
            <p>Bonjour ${data.customerName},</p>
            <p>Merci pour votre commande ! Nous l'avons bien reçue et elle est en cours de traitement.</p>
            
            <h2 style="color: #0f1729;">Commande n° ${data.orderNumber}</h2>
            
            <table class="order-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Qté</th>
                  <th style="text-align: right;">Prix unit.</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total-row">Sous-total: ${formatPrice(data.subtotal, data.currency)}</div>
              <div class="total-row">Livraison: ${formatPrice(data.shippingCost, data.currency)}</div>
              <div class="total-row grand-total">Total: ${formatPrice(data.total, data.currency)}</div>
            </div>
            
            <h3 style="margin-top: 30px;">Adresse de livraison</h3>
            <p>
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
              ${data.shippingAddress.country}
            </p>
            
            <p style="margin-top: 30px;">Vous recevrez un email dès que votre commande sera expédiée.</p>
            
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
      subject: `Confirmation de votre commande ${data.orderNumber}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
