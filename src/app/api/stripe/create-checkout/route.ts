import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
    const { email, planType = 'monthly' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Define plan configurations
    const plans = {
      monthly: {
        price_id: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_newsletter',
        amount: 500, // $5.00
        interval: 'month'
      },
      yearly: {
        price_id: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_newsletter',
        amount: 5000, // $50.00 (2 months free)
        interval: 'year'
      }
    };

    const selectedPlan = plans[planType as keyof typeof plans];
    
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'YaadFeed Newsletter Subscription',
              description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} access to exclusive Jamaican news insights`,
              images: ['https://yaadfeed.com/logo.png'],
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: selectedPlan.interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/newsletter?canceled=true`,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          plan_type: planType,
          service: 'yaadfeed_newsletter'
        }
      },
      metadata: {
        plan_type: planType,
        service: 'yaadfeed_newsletter'
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
