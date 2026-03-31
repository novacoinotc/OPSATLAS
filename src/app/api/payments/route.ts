import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const company = searchParams.get("company") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const minAmount = searchParams.get("minAmount") || "";
  const maxAmount = searchParams.get("maxAmount") || "";
  const clabe = searchParams.get("clabe") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};

  if (search) {
    where.OR = [
      { trackingKey: { contains: search, mode: "insensitive" } },
      { payerName: { contains: search, mode: "insensitive" } },
      { concept: { contains: search, mode: "insensitive" } },
      { payerAccount: { contains: search } },
      { numericalReference: { contains: search } },
    ];
  }

  if (company) {
    where.company = company;
  }

  if (clabe) {
    where.beneficiaryAccount = clabe;
  }

  if (dateFrom || dateTo) {
    where.receivedTimestamp = {};
    if (dateFrom) where.receivedTimestamp.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.receivedTimestamp.lte = end;
    }
  }

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = parseFloat(minAmount);
    if (maxAmount) where.amount.lte = parseFloat(maxAmount);
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { receivedTimestamp: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return NextResponse.json({
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
