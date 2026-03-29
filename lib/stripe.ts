// Placeholder — AFRIKHER uses FIDEPAY for payments, not direct Stripe SDK.
// This module exists only to prevent build errors from legacy API routes.

export const stripe = {
  checkout: {
    sessions: {
      async create(_opts: any) {
        throw new Error("Stripe direct integration disabled. Use FIDEPAY.");
      },
    },
  },
} as any;
