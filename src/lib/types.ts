import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    role: string;
  }
}

// JWT type augmentation
declare module "@auth/core/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}

export interface WebhookPayload {
  trackingKey: string;
  amount: number;
  payerName: string;
  payerAccount: string;
  beneficiaryAccount: string;
  concept?: string;
  numericalReference?: string;
  receivedTimestamp: string;
}

export interface PaymentFilters {
  search?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
  page?: string;
  limit?: string;
}
