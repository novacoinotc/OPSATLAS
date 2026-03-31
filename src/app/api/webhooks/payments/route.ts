import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCompanyFromClabe, isValidClabe } from "@/lib/utils";
import type { WebhookPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!authHeader || !expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== expectedSecret) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: WebhookPayload = await request.json();

    // Validate required fields
    if (!body.trackingKey || !body.amount || !body.beneficiaryAccount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate CLABE belongs to our accounts
    if (!isValidClabe(body.beneficiaryAccount)) {
      return NextResponse.json(
        { error: "Unknown beneficiary account" },
        { status: 400 }
      );
    }

    // Determine company
    const company = getCompanyFromClabe(body.beneficiaryAccount);

    // Check for duplicate
    const existing = await prisma.payment.findUnique({
      where: { trackingKey: body.trackingKey },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Payment already processed", id: existing.id },
        { status: 200 }
      );
    }

    // Store payment
    const payment = await prisma.payment.create({
      data: {
        trackingKey: body.trackingKey,
        amount: body.amount,
        payerName: body.payerName,
        payerAccount: body.payerAccount,
        beneficiaryAccount: body.beneficiaryAccount,
        concept: body.concept || null,
        numericalReference: body.numericalReference?.toString() || null,
        receivedTimestamp: new Date(body.receivedTimestamp),
        company,
      },
    });

    return NextResponse.json(
      { message: "Payment received", id: payment.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
