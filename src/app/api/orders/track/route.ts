import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, email } = body;

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        order_number: orderNumber,
        customer_email: email.toLowerCase(),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order number and email." },
        { status: 404 }
      );
    }

    const orderData = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      currency: order.currency,
      subtotal: order.subtotal_kobo,
      shipping: order.shipping_kobo,
      total: order.total_kobo,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address_json,
      paidAt: order.paid_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      trackingNumber: order.tracking_number,
      deliveryNotes: order.delivery_notes,
      shippedAt: order.shipped_at,
      deliveredAt: order.delivered_at,
      items: order.items.map((item) => ({
        id: item.id,
        title: item.title_snapshot,
        size: item.size_snapshot || (item.variant_json as { size?: string } | null)?.size || null,
        quantity: item.quantity,
        unitPrice: item.unit_price_kobo,
        lineTotal: item.line_total_kobo,
        variant: item.variant_json,
        product: item.product,
      })),
    };

    return NextResponse.json({ order: orderData });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching your order" },
      { status: 500 }
    );
  }
}