import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalPayments,
    todayPayments,
    todayAmount,
    weekAmount,
    monthAmount,
    byCompany,
    recentPayments,
    dailyChart,
  ] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({
      where: { receivedTimestamp: { gte: todayStart } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { receivedTimestamp: { gte: todayStart } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { receivedTimestamp: { gte: weekStart } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { receivedTimestamp: { gte: monthStart } },
    }),
    prisma.payment.groupBy({
      by: ["company"],
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.findMany({
      orderBy: { receivedTimestamp: "desc" },
      take: 10,
    }),
    // Last 30 days daily totals
    prisma.$queryRaw`
      SELECT
        DATE(p."receivedTimestamp") as date,
        SUM(p.amount) as total,
        COUNT(*)::int as count
      FROM payments p
      WHERE p."receivedTimestamp" >= ${new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)}
      GROUP BY DATE(p."receivedTimestamp")
      ORDER BY date ASC
    `,
  ]);

  return NextResponse.json({
    totalPayments,
    todayPayments,
    todayAmount: todayAmount._sum.amount || 0,
    weekAmount: weekAmount._sum.amount || 0,
    monthAmount: monthAmount._sum.amount || 0,
    byCompany: byCompany.map((c) => ({
      company: c.company,
      total: c._sum.amount || 0,
      count: c._count,
    })),
    recentPayments,
    dailyChart,
  });
}
