import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia', // using the latest valid API version expected by ts
  appInfo: {
    name: 'CVMatch Pro',
    version: '0.1.0',
  },
});
