import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

// Update order status (with email notification)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, deliveryNotes } = body;

    // Validate status
    const validStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "IN_TRANSIT",
      "DELIVERED",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { title: true, slug: true, images: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = { status };

    // Add tracking number if provided
    if (trackingNumber !== undefined) {
      updateData.tracking_number = trackingNumber;
    }

    // Add delivery notes if provided
    if (deliveryNotes !== undefined) {
      updateData.delivery_notes = deliveryNotes;
    }

    // Set timestamps based on status
    if (status === "IN_TRANSIT" && !order.shipped_at) {
      updateData.shipped_at = new Date();
    }

    if (status === "DELIVERED" && !order.delivered_at) {
      updateData.delivered_at = new Date();
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    logSecurityEvent("order_status_updated", {
      orderId: id,
      oldStatus: order.status,
      newStatus: status,
      trackingNumber,
    });

    // Send email notification for status changes
    const notifyStatuses = ["PROCESSING", "IN_TRANSIT", "DELIVERED"];
    if (notifyStatuses.includes(status) && order.status !== status) {
      try {
        const shippingAddress = order.shipping_address_json as any;
        await sendOrderStatusUpdateEmail({
          orderNumber: order.order_number,
          customerEmail: order.customer_email,
          customerName: shippingAddress?.fullName || "Customer",
          items: order.items.map((item) => ({
            title: item.title_snapshot,
            size: item.size_snapshot || undefined,
            quantity: item.quantity,
            unitPrice: item.unit_price_kobo,
            lineTotal: item.line_total_kobo,
          })),
          subtotal: order.subtotal_kobo,
          shipping: order.shipping_kobo,
          total: order.total_kobo,
          currency: order.currency,
          shippingAddress: {
            fullName: shippingAddress?.fullName || "",
            address1: shippingAddress?.address1 || "",
            address2: shippingAddress?.address2,
            city: shippingAddress?.city || "",
            state: shippingAddress?.state || "",
            country: shippingAddress?.country || "",
            postalCode: shippingAddress?.postalCode,
          },
          status,
          trackingNumber: updatedOrder.tracking_number || undefined,
          deliveryNotes: updatedOrder.delivery_notes || undefined,
        });

        logSecurityEvent("order_status_email_sent", {
          orderId: id,
          status,
        });
      } catch (emailError) {
        logSecurityEvent("order_status_email_failed", {
          orderId: id,
          error: emailError instanceof Error ? emailError.message : "Unknown",
        });
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: true,
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
              },
            },
          },
        },
        payment_events: {
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}