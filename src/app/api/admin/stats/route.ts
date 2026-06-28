import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue,
      totalSubscribers,
      activeSubscribers,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { total_kobo: true },
      }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          order_number: true,
          status: true,
          total_kobo: true,
          currency: true,
          customer_email: true,
          created_at: true,
        },
      }),
    ]);

    return NextResponse.json({
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        paid: paidOrders,
      },
      revenue: {
        total: totalRevenue._sum.total_kobo || 0,
      },
      subscribers: {
        total: totalSubscribers,
        active: activeSubscribers,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}