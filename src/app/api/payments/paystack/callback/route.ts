import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security";
import { getAppUrl } from "@/lib/app-url";

/**
 * Callback handler for Paystack payment verification
 * 
 * This is a SIMPLE redirect handler. The actual payment processing is done by:
 * 1. Webhook handler (/api/webhooks/paystack) - primary
 * 2. This callback - fallback verification
 * 
 * The webhook is more reliable because:
 * - It works even if user closes browser
 * - It's server-to-server
 * - Paystack retries failed deliveries
 */

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl(request);
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const status = searchParams.get("status");

    // Log the callback for debugging
    logSecurityEvent("paystack_callback_received", {
      reference,
      status,
      url: request.url,
    });

    // If no reference, redirect to failed
    if (!reference) {
      logSecurityEvent("callback_no_reference", { status });
      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { paystack_reference: reference },
    });

    if (!order) {
      logSecurityEvent("callback_order_not_found", { reference });
      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }

    // If order is already PAID (processed by webhook), redirect to success
    if (order.status === "PAID") {
      logSecurityEvent("callback_order_already_paid", {
        orderId: order.id,
        reference,
      });
      return NextResponse.redirect(new URL("/order/success", appUrl));
    }

    // If order is FAILED, redirect to failed
    if (order.status === "FAILED") {
      logSecurityEvent("callback_order_already_failed", {
        orderId: order.id,
        reference,
      });
      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }

    // If order is still PENDING, verify with Paystack API
    if (order.status === "PENDING" && secretKey) {
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            headers: { Authorization: `Bearer ${secretKey}` },
          }
        );

        const json = await verifyRes.json();

        // Log verification response
        logSecurityEvent("callback_verify_response", {
          reference,
          apiStatus: json?.status,
          transactionStatus: json?.data?.status,
          amount: json?.data?.amount,
          expectedAmount: order.total_kobo,
        });

        // Check if payment was successful
        const isSuccess =
          verifyRes.ok &&
          json?.status === true &&
          json?.data?.status === "success" &&
          Number(json?.data?.amount) === order.total_kobo;

        if (isSuccess) {
          // Update order status atomically
          const updated = await prisma.order.updateMany({
            where: { id: order.id, status: "PENDING" },
            data: {
              status: "PAID",
              paystack_transaction_id: String(json.data.id ?? ""),
              paid_at: new Date(),
            },
          });

          if (updated.count > 0) {
            logSecurityEvent("callback_payment_verified", {
              orderId: order.id,
              reference,
            });

            // Record payment event
            await prisma.paymentEvent.create({
              data: {
                order_id: order.id,
                reference,
                event_type: "PAYSTACK_CALLBACK_SUCCESS",
                payload_json: json,
              },
            });
          }

          return NextResponse.redirect(new URL("/order/success", appUrl));
        } else {
          // Payment verification failed
          logSecurityEvent("callback_payment_failed", {
            orderId: order.id,
            reference,
            reason: json?.message || "Verification failed",
          });

          // Mark as failed
          await prisma.order.updateMany({
            where: { id: order.id, status: "PENDING" },
            data: { status: "FAILED" },
          });

          return NextResponse.redirect(new URL("/order/failed", appUrl));
        }
      } catch (verifyError) {
        // Verification API call failed
        logSecurityEvent("callback_verify_error", {
          orderId: order.id,
          reference,
          error: verifyError instanceof Error ? verifyError.message : "Unknown",
        });

        // Don't mark as failed - webhook might still process it
        // Redirect to a "processing" page or check order status
        return NextResponse.redirect(new URL("/order/track", appUrl));
      }
    }

    // For any other status, redirect to track page
    logSecurityEvent("callback_redirect_to_track", {
      orderId: order.id,
      reference,
      status: order.status,
    });

    return NextResponse.redirect(new URL("/order/track", appUrl));
  } catch (error) {
    logSecurityEvent("callback_error", {
      error: error instanceof Error ? error.message : "Unknown",
    });

    // On error, redirect to track page so user can check status
    return NextResponse.redirect(new URL("/order/track", appUrl));
  }
}