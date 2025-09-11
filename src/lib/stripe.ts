import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(
  
  process.env.STRIPE_SECRET_KEY || '',
  {
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'YaadFeed',
      version: '1.0.0',
    },
  }
);

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
};

// Stripe configuration
export const stripeConfig = {
  currency: 'usd',
  plans: {
    newsletter: {
      name: 'Newsletter Subscription',
      description: 'Monthly newsletter with exclusive Jamaican news and artist content',
      price: 5.00, // $5 per month
      interval: 'month',
      features: [
        'Weekly newsletter with curated content',
        'Exclusive artist interviews',
        'Early access to event announcements',
        'Premium news analysis',
        'Ad-free reading experience',
      ],
    },
  },
};

// Stripe helpers
export const stripeHelpers = {
  // Create a checkout session
  createCheckoutSession: async (userId: string, plan: 'newsletter') => {
    const planConfig = stripeConfig.plans[plan];
    
    const session = await stripe.checkout.sessions.create({
      customer_creation: 'always',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: stripeConfig.currency,
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
            unit_amount: Math.round(planConfig.price * 100), // Convert to cents
            recurring: {
              interval: planConfig.interval as 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/cancelled`,
      metadata: {
        userId,
        plan,
      },
    });

    return session;
  },

  // Create a customer portal session
  createPortalSession: async (customerId: string) => {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    });

    return session;
  },

  // Get subscription details
  getSubscription: async (subscriptionId: string) => {
    return await stripe.subscriptions.retrieve(subscriptionId);
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string) => {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  },

  // Resume subscription
  resumeSubscription: async (subscriptionId: string) => {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  },

  // Get customer by email
  getCustomerByEmail: async (email: string) => {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  },

  // Create customer
  createCustomer: async (email: string, name?: string, metadata?: Record<string, string>) => {
    return await stripe.customers.create({
      email,
      name,
      metadata,
    });
  },

  // Construct webhook event
  constructWebhookEvent: (payload: string | Buffer, signature: string) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  },
};

// Webhook event handlers
export const webhookHandlers = {
  'checkout.session.completed': async (session: Stripe.Checkout.Session) => {
    console.log('Checkout session completed:', session.id);
    
    // Handle successful subscription creation
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      // Update user subscription in database
      // This would typically be handled in your webhook API route
      return {
        type: 'subscription_created',
        data: {
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          userId: session.metadata?.userId,
          plan: session.metadata?.plan,
          status: subscription.status,
        },
      };
    }
  },

  'invoice.payment_succeeded': async (invoice: Stripe.Invoice) => {
    console.log('Invoice payment succeeded:', invoice.id);
    
    // Handle successful payment
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      
      return {
        type: 'payment_succeeded',
        data: {
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        },
      };
    }
  },

  'invoice.payment_failed': async (invoice: Stripe.Invoice) => {
    console.log('Invoice payment failed:', invoice.id);
    
    // Handle failed payment
    return {
      type: 'payment_failed',
      data: {
        subscriptionId: invoice.subscription as string,
        customerId: invoice.customer as string,
        amount: invoice.amount_due,
        currency: invoice.currency,
      },
    };
  },

  'customer.subscription.updated': async (subscription: Stripe.Subscription) => {
    console.log('Subscription updated:', subscription.id);
    
    return {
      type: 'subscription_updated',
      data: {
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    };
  },

  'customer.subscription.deleted': async (subscription: Stripe.Subscription) => {
    console.log('Subscription deleted:', subscription.id);
    
    return {
      type: 'subscription_deleted',
      data: {
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
      },
    };
  },
};

// Pricing utilities
export const pricingUtils = {
  formatPrice: (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  },

  calculateProration: (currentPrice: number, newPrice: number, daysRemaining: number, totalDays: number) => {
    const unusedAmount = (currentPrice / totalDays) * daysRemaining;
    const newAmount = (newPrice / totalDays) * daysRemaining;
    return newAmount - unusedAmount;
  },

  getNextBillingDate: (subscription: Stripe.Subscription) => {
    return new Date(subscription.current_period_end * 1000);
  },
};

// Test helpers for development
export const testHelpers = {
  createTestCheckoutSession: async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Test helpers only available in development');
    }

    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Newsletter Subscription',
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
  },

  testCards: {
    visa: '4242424242424242',
    visaDebit: '4000056655665556',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    declined: '4000000000000002',
    insufficientFunds: '4000000000009995',
    expiredCard: '4000000000000069',
  },
};
