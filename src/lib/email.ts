import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    title: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
}

function formatPrice(amount: number, currency: string = "NGN") {
  const formatted = (amount / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${currency === "NGN" ? "" : currency} ${formatted}`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const {
    orderNumber,
    customerEmail,
    customerName,
    items,
    subtotal,
    shipping,
    total,
    currency,
    shippingAddress,
  } = data;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7;">
          <div style="font-weight: 500; color: #0a0a0a;">${item.title}</div>
          <div style="font-size: 14px; color: #71717a;">
            ${item.size ? `Size: ${item.size} | ` : ""}Qty: ${item.quantity}
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; text-align: right; font-weight: 500;">
          ${formatPrice(item.lineTotal, currency)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - ${orderNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #0a0a0a; margin: 0; letter-spacing: -0.5px;">
              DEMURBAN
            </h1>
            <p style="font-size: 14px; color: #71717a; margin-top: 4px;">
              Where Taste Meets Identity
            </p>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">✓</div>
            <h2 style="font-size: 18px; font-weight: 600; color: #166534; margin: 0;">
              Payment Successful!
            </h2>
            <p style="font-size: 14px; color: #15803d; margin: 8px 0 0;">
              Thank you for your order, ${customerName}
            </p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #0a0a0a; margin: 0 0 16px;">
              Order Details
            </h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #71717a;">Order Number:</span>
              <span style="font-size: 14px; font-weight: 500; color: #0a0a0a;">${orderNumber}</span>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #0a0a0a; margin: 0 0 16px;">
              Items Ordered
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e4e4e7;">
                    Item
                  </th>
                  <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e4e4e7;">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #71717a;">Subtotal</span>
                <span style="font-size: 14px; color: #0a0a0a;">${formatPrice(subtotal, currency)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #71717a;">Shipping</span>
                <span style="font-size: 14px; color: #0a0a0a;">${shipping === 0 ? "Free" : formatPrice(shipping, currency)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e4e4e7; margin-top: 12px;">
                <span style="font-size: 16px; font-weight: 600; color: #0a0a0a;">Total</span>
                <span style="font-size: 16px; font-weight: 600; color: #0a0a0a;">${formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #0a0a0a; margin: 0 0 16px;">
              Shipping Address
            </h3>
            <div style="font-size: 14px; color: #0a0a0a; line-height: 1.6;">
              <p style="font-weight: 500; margin: 0;">${shippingAddress.fullName}</p>
              <p style="margin: 0;">${shippingAddress.address1}</p>
              ${shippingAddress.address2 ? `<p style="margin: 0;">${shippingAddress.address2}</p>` : ""}
              <p style="margin: 0;">${shippingAddress.city}, ${shippingAddress.state}</p>
              <p style="margin: 0;">${shippingAddress.country}</p>
              ${shippingAddress.postalCode ? `<p style="margin: 0;">${shippingAddress.postalCode}</p>` : ""}
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.APP_URL}/order/track" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
              Track Your Order
            </a>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e4e4e7;">
            <p style="font-size: 14px; color: #71717a; margin: 0;">
              Questions? Contact us at <a href="mailto:support@demurban.com" style="color: #c41e3a; text-decoration: none;">support@demurban.com</a>
            </p>
            <p style="font-size: 12px; color: #a1a1aa; margin-top: 16px;">
              © ${new Date().getFullYear()} DEMURBAN. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "DEMURBAN <orders@demurban.com>",
      to: customerEmail,
      subject: `Order Confirmed - ${orderNumber}`,
      html,
    });

    console.log(`Order confirmation email sent to ${customerEmail}:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendOrderStatusUpdateEmail(
  data: OrderEmailData & { status: string; trackingNumber?: string; deliveryNotes?: string }
) {
  const {
    orderNumber,
    customerEmail,
    customerName,
    status,
    trackingNumber,
    deliveryNotes,
  } = data;

  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    PROCESSING: {
      title: "Order Being Processed",
      message: "We're preparing your order for shipment. You'll receive another update soon.",
      color: "#2563eb",
    },
    IN_TRANSIT: {
      title: "Order Shipped!",
      message: "Your order is on its way! Track your delivery using the tracking number below.",
      color: "#7c3aed",
    },
    DELIVERED: {
      title: "Order Delivered!",
      message: "Your order has been delivered. Enjoy your new DEMURBAN pieces!",
      color: "#16a34a",
    },
  };

  const statusInfo = statusMessages[status] || {
    title: "Order Update",
    message: `Your order status has been updated to: ${status}`,
    color: "#0a0a0a",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - ${orderNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #0a0a0a; margin: 0; letter-spacing: -0.5px;">
              DEMURBAN
            </h1>
            <p style="font-size: 14px; color: #71717a; margin-top: 4px;">
              Where Taste Meets Identity
            </p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <h2 style="font-size: 20px; font-weight: 600; color: ${statusInfo.color}; margin: 0 0 8px;">
              ${statusInfo.title}
            </h2>
            <p style="font-size: 14px; color: #71717a; margin: 0;">
              ${statusInfo.message}
            </p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #0a0a0a; margin: 0 0 16px;">
              Order ${orderNumber}
            </h3>
            ${trackingNumber ? `
              <div style="margin-bottom: 12px;">
                <span style="font-size: 14px; color: #71717a;">Tracking Number:</span>
                <span style="font-size: 14px; font-weight: 500; color: #0a0a0a; margin-left: 8px;">${trackingNumber}</span>
              </div>
            ` : ""}
            ${deliveryNotes ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e4e4e7;">
                <span style="font-size: 14px; color: #71717a;">Delivery Notes:</span>
                <p style="font-size: 14px; color: #0a0a0a; margin: 4px 0 0;">${deliveryNotes}</p>
              </div>
            ` : ""}
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.APP_URL}/order/track" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
              Track Your Order
            </a>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e4e4e7;">
            <p style="font-size: 14px; color: #71717a; margin: 0;">
              Questions? Contact us at <a href="mailto:support@demurban.com" style="color: #c41e3a; text-decoration: none;">support@demurban.com</a>
            </p>
            <p style="font-size: 12px; color: #a1a1aa; margin-top: 16px;">
              © ${new Date().getFullYear()} DEMURBAN. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "DEMURBAN <orders@demurban.com>",
      to: customerEmail,
      subject: `${statusInfo.title} - Order ${orderNumber}`,
      html,
    });

    console.log(`Order status email sent to ${customerEmail}:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send order status email:", error);
    return { success: false, error };
  }
}