import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const clabe = searchParams.get("clabe") || "";

  const where: Prisma.PaymentWhereInput = {};

  if (company) where.company = company;
  if (clabe) where.beneficiaryAccount = clabe;
  if (dateFrom || dateTo) {
    where.receivedTimestamp = {};
    if (dateFrom) where.receivedTimestamp.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.receivedTimestamp.lte = end;
    }
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { receivedTimestamp: "desc" },
  });

  const headers = [
    "Clave Rastreo",
    "Monto",
    "Ordenante",
    "CLABE Origen",
    "CLABE Destino",
    "Empresa",
    "Concepto",
    "Referencia",
    "Fecha",
  ];

  const rows = payments.map((p) => [
    p.trackingKey,
    p.amount.toString(),
    `"${p.payerName}"`,
    p.payerAccount,
    p.beneficiaryAccount,
    p.company,
    `"${p.concept || ""}"`,
    p.numericalReference || "",
    formatDate(p.receivedTimestamp),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="pagos_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
