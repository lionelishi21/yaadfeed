#!/usr/bin/env python3
"""
YaadFeed Payment Processor
Handles Stripe payments for newsletter subscriptions and manages subscriber data
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
import hashlib
import uuid

@dataclass
class Subscriber:
    email: str
    stripe_customer_id: str
    subscription_id: str
    subscription_status: str  # active, canceled, past_due, unpaid
    plan_id: str
    amount: float
    currency: str = "USD"
    created_at: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    metadata: Optional[Dict] = None

@dataclass
class PaymentEvent:
    event_id: str
    event_type: str
    customer_id: str
    subscription_id: Optional[str]
    amount: Optional[float]
    status: str
    timestamp: datetime
    metadata: Optional[Dict] = None

class StripePaymentProcessor:
    def __init__(self):
        self.config = self.load_payment_config()
        self.subscribers_file = "/workspace/yaadfeed/data/subscribers.json"
        self.payments_log = "/workspace/yaadfeed/data/payments_log.json"
        self.webhooks_log = "/workspace/yaadfeed/data/webhooks_log.json"
        
        # Ensure data directory exists
        os.makedirs("/workspace/yaadfeed/data", exist_ok=True)
        
        # Initialize subscriber and payment tracking
        self.subscribers = self.load_subscribers()
        self.payment_events = self.load_payment_events()
    
    def load_payment_config(self) -> Dict:
        """Load Stripe payment configuration"""
        default_config = {
            "stripe": {
                "publishable_key": "pk_test_...",  # Replace with actual Stripe publishable key
                "secret_key": "sk_test_...",      # Replace with actual Stripe secret key
                "webhook_secret": "whsec_...",    # Replace with actual webhook secret
                "success_url": "https://yaadfeed.com/success",
                "cancel_url": "https://yaadfeed.com/cancel"
            },
            "newsletter_plans": {
                "monthly": {
                    "id": "price_monthly_newsletter",
                    "name": "YaadFeed Monthly Newsletter",
                    "amount": 500,  # $5.00 in cents
                    "currency": "USD",
                    "interval": "month",
                    "description": "Monthly access to exclusive Jamaican news insights and content"
                },
                "yearly": {
                    "id": "price_yearly_newsletter",
                    "name": "YaadFeed Yearly Newsletter",
                    "amount": 5000,  # $50.00 in cents (2 months free)
                    "currency": "USD",
                    "interval": "year",
                    "description": "Yearly access to exclusive Jamaican news insights and content"
                }
            },
            "features": {
                "trial_period_days": 7,
                "auto_retry_failed_payments": True,
                "send_receipt_emails": True,
                "dunning_management": True
            }
        }
        
        config_file = "/workspace/yaadfeed/automation/payment_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    return {**default_config, **json.load(f)}
            except Exception as e:
                print(f"Error loading payment config: {e}")
                return default_config
        else:
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config
    
    def load_subscribers(self) -> Dict[str, Subscriber]:
        """Load existing subscribers"""
        if os.path.exists(self.subscribers_file):
            try:
                with open(self.subscribers_file, 'r') as f:
                    data = json.load(f)
                    subscribers = {}
                    for email, sub_data in data.items():
                        # Convert date strings back to datetime objects
                        if sub_data.get('created_at'):
                            sub_data['created_at'] = datetime.fromisoformat(sub_data['created_at'])
                        if sub_data.get('next_billing_date'):
                            sub_data['next_billing_date'] = datetime.fromisoformat(sub_data['next_billing_date'])
                        if sub_data.get('trial_end'):
                            sub_data['trial_end'] = datetime.fromisoformat(sub_data['trial_end'])
                        
                        subscribers[email] = Subscriber(**sub_data)
                    return subscribers
            except Exception as e:
                print(f"Error loading subscribers: {e}")
                return {}
        return {}
    
    def load_payment_events(self) -> List[PaymentEvent]:
        """Load payment events log"""
        if os.path.exists(self.payments_log):
            try:
                with open(self.payments_log, 'r') as f:
                    data = json.load(f)
                    events = []
                    for event_data in data:
                        event_data['timestamp'] = datetime.fromisoformat(event_data['timestamp'])
                        events.append(PaymentEvent(**event_data))
                    return events
            except Exception as e:
                print(f"Error loading payment events: {e}")
                return []
        return []
    
    def save_subscribers(self):
        """Save subscribers to file"""
        data = {}
        for email, subscriber in self.subscribers.items():
            sub_dict = asdict(subscriber)
            # Convert datetime objects to ISO strings
            if sub_dict.get('created_at'):
                sub_dict['created_at'] = sub_dict['created_at'].isoformat()
            if sub_dict.get('next_billing_date'):
                sub_dict['next_billing_date'] = sub_dict['next_billing_date'].isoformat()
            if sub_dict.get('trial_end'):
                sub_dict['trial_end'] = sub_dict['trial_end'].isoformat()
            data[email] = sub_dict
        
        with open(self.subscribers_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def save_payment_events(self):
        """Save payment events to file"""
        data = []
        for event in self.payment_events:
            event_dict = asdict(event)
            event_dict['timestamp'] = event_dict['timestamp'].isoformat()
            data.append(event_dict)
        
        with open(self.payments_log, 'w') as f:
            json.dump(data, f, indent=2)
    
    def create_checkout_session(self, email: str, plan_type: str = "monthly") -> Dict:
        """Create Stripe checkout session for newsletter subscription"""
        
        plan = self.config["newsletter_plans"][plan_type]
        session_id = str(uuid.uuid4())
        
        # In production, this would call Stripe API
        checkout_session = {
            "id": f"cs_{session_id[:24]}",
            "object": "checkout.session",
            "customer_email": email,
            "mode": "subscription",
            "line_items": [{
                "price": plan["id"],
                "quantity": 1
            }],
            "success_url": f"{self.config['stripe']['success_url']}?session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url": self.config['stripe']['cancel_url'],
            "subscription_data": {
                "trial_period_days": self.config["features"]["trial_period_days"]
            },
            "metadata": {
                "plan_type": plan_type,
                "service": "yaadfeed_newsletter"
            }
        }
        
        print(f"Created checkout session for {email}: {checkout_session['id']}")
        return checkout_session
    
    def process_successful_payment(self, session_data: Dict) -> Subscriber:
        """Process successful payment and create subscriber"""
        
        email = session_data["customer_email"]
        plan_type = session_data["metadata"]["plan_type"]
        plan = self.config["newsletter_plans"][plan_type]
        
        # Generate IDs (in production, these come from Stripe)
        customer_id = f"cus_{hashlib.md5(email.encode()).hexdigest()[:24]}"
        subscription_id = f"sub_{hashlib.md5(f'{email}_{datetime.now()}'.encode()).hexdigest()[:24]}"
        
        # Calculate billing dates
        created_at = datetime.now()
        trial_end = created_at + timedelta(days=self.config["features"]["trial_period_days"])
        
        if plan["interval"] == "month":
            next_billing = trial_end + timedelta(days=30)
        else:  # yearly
            next_billing = trial_end + timedelta(days=365)
        
        # Create subscriber
        subscriber = Subscriber(
            email=email,
            stripe_customer_id=customer_id,
            subscription_id=subscription_id,
            subscription_status="active",
            plan_id=plan["id"],
            amount=plan["amount"] / 100,  # Convert from cents
            currency=plan["currency"],
            created_at=created_at,
            next_billing_date=next_billing,
            trial_end=trial_end,
            metadata={
                "plan_type": plan_type,
                "checkout_session_id": session_data["id"]
            }
        )
        
        # Save subscriber
        self.subscribers[email] = subscriber
        self.save_subscribers()
        
        # Log payment event
        event = PaymentEvent(
            event_id=str(uuid.uuid4()),
            event_type="subscription_created",
            customer_id=customer_id,
            subscription_id=subscription_id,
            amount=subscriber.amount,
            status="succeeded",
            timestamp=datetime.now(),
            metadata={"plan_type": plan_type}
        )
        
        self.payment_events.append(event)
        self.save_payment_events()
        
        print(f"Successfully processed subscription for {email}")
        return subscriber
    
    def handle_subscription_renewal(self, subscription_id: str, amount: float) -> bool:
        """Handle subscription renewal payment"""
        
        # Find subscriber by subscription ID
        subscriber = None
        for sub in self.subscribers.values():
            if sub.subscription_id == subscription_id:
                subscriber = sub
                break
        
        if not subscriber:
            print(f"Subscriber not found for subscription {subscription_id}")
            return False
        
        # Update next billing date
        if subscriber.metadata and subscriber.metadata.get('plan_type') == 'yearly':
            subscriber.next_billing_date = datetime.now() + timedelta(days=365)
        else:
            subscriber.next_billing_date = datetime.now() + timedelta(days=30)
        
        # Log renewal event
        event = PaymentEvent(
            event_id=str(uuid.uuid4()),
            event_type="invoice_payment_succeeded",
            customer_id=subscriber.stripe_customer_id,
            subscription_id=subscription_id,
            amount=amount,
            status="succeeded",
            timestamp=datetime.now()
        )
        
        self.payment_events.append(event)
        self.save_payment_events()
        self.save_subscribers()
        
        print(f"Processed renewal for subscription {subscription_id}")
        return True
    
    def handle_failed_payment(self, subscription_id: str, amount: float) -> bool:
        """Handle failed payment"""
        
        # Find subscriber
        subscriber = None
        for sub in self.subscribers.values():
            if sub.subscription_id == subscription_id:
                subscriber = sub
                break
        
        if not subscriber:
            return False
        
        # Update subscription status
        subscriber.subscription_status = "past_due"
        
        # Log failed payment event
        event = PaymentEvent(
            event_id=str(uuid.uuid4()),
            event_type="invoice_payment_failed",
            customer_id=subscriber.stripe_customer_id,
            subscription_id=subscription_id,
            amount=amount,
            status="failed",
            timestamp=datetime.now()
        )
        
        self.payment_events.append(event)
        self.save_payment_events()
        self.save_subscribers()
        
        print(f"Processed failed payment for subscription {subscription_id}")
        return True
    
    def cancel_subscription(self, email: str) -> bool:
        """Cancel a subscription"""
        
        if email not in self.subscribers:
            print(f"Subscriber {email} not found")
            return False
        
        subscriber = self.subscribers[email]
        subscriber.subscription_status = "canceled"
        
        # Log cancellation event
        event = PaymentEvent(
            event_id=str(uuid.uuid4()),
            event_type="customer_subscription_deleted",
            customer_id=subscriber.stripe_customer_id,
            subscription_id=subscriber.subscription_id,
            amount=None,
            status="canceled",
            timestamp=datetime.now()
        )
        
        self.payment_events.append(event)
        self.save_payment_events()
        self.save_subscribers()
        
        print(f"Canceled subscription for {email}")
        return True
    
    def get_active_subscribers(self) -> List[Subscriber]:
        """Get all active subscribers"""
        return [sub for sub in self.subscribers.values() if sub.subscription_status == "active"]
    
    def get_subscriber_analytics(self) -> Dict:
        """Get subscriber analytics"""
        
        total_subscribers = len(self.subscribers)
        active_subscribers = len(self.get_active_subscribers())
        
        # Revenue calculations
        monthly_revenue = sum(sub.amount for sub in self.subscribers.values() 
                            if sub.subscription_status == "active" and 
                            sub.metadata and sub.metadata.get('plan_type') == 'monthly')
        
        yearly_revenue = sum(sub.amount for sub in self.subscribers.values() 
                           if sub.subscription_status == "active" and 
                           sub.metadata and sub.metadata.get('plan_type') == 'yearly')
        
        # Subscription breakdown
        plan_breakdown = {}
        for sub in self.subscribers.values():
            if sub.metadata and sub.metadata.get('plan_type'):
                plan_type = sub.metadata['plan_type']
                plan_breakdown[plan_type] = plan_breakdown.get(plan_type, 0) + 1
        
        analytics = {
            "total_subscribers": total_subscribers,
            "active_subscribers": active_subscribers,
            "cancellation_rate": ((total_subscribers - active_subscribers) / total_subscribers * 100) if total_subscribers > 0 else 0,
            "monthly_recurring_revenue": monthly_revenue,
            "yearly_revenue": yearly_revenue,
            "total_revenue": monthly_revenue + yearly_revenue,
            "plan_breakdown": plan_breakdown,
            "recent_signups": len([sub for sub in self.subscribers.values() 
                                 if sub.created_at and sub.created_at > datetime.now() - timedelta(days=7)]),
            "trial_conversions": len([sub for sub in self.subscribers.values() 
                                    if sub.trial_end and sub.trial_end < datetime.now() and sub.subscription_status == "active"])
        }
        
        return analytics
    
    def generate_revenue_report(self) -> str:
        """Generate comprehensive revenue report"""
        
        analytics = self.get_subscriber_analytics()
        
        report = f"""
# YaadFeed Newsletter Revenue Report

## Overview
- **Report Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Total Subscribers**: {analytics['total_subscribers']}
- **Active Subscribers**: {analytics['active_subscribers']}
- **Cancellation Rate**: {analytics['cancellation_rate']:.1f}%

## Revenue Metrics
- **Monthly Recurring Revenue**: ${analytics['monthly_recurring_revenue']:.2f}
- **Yearly Revenue**: ${analytics['yearly_revenue']:.2f}
- **Total Revenue**: ${analytics['total_revenue']:.2f}

## Subscription Breakdown
"""
        
        for plan, count in analytics['plan_breakdown'].items():
            report += f"- **{plan.title()} Plan**: {count} subscribers\n"
        
        report += f"""
## Growth Metrics
- **Recent Signups (7 days)**: {analytics['recent_signups']}
- **Trial Conversions**: {analytics['trial_conversions']}

## Recent Activity
- **Total Payment Events**: {len(self.payment_events)}
- **Last 30 Days Events**: {len([e for e in self.payment_events if e.timestamp > datetime.now() - timedelta(days=30)])}

---
*Generated by YaadFeed Payment Processor*
        """.strip()
        
        # Save report
        report_file = f"/workspace/yaadfeed/automation/revenue_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w') as f:
            f.write(report)
        
        print(f"Revenue report saved to: {report_file}")
        return report_file

def main():
    """Demo payment processing functionality"""
    processor = StripePaymentProcessor()
    
    print("YaadFeed Payment Processor")
    print("=========================")
    
    # Demo: Create checkout sessions
    print("\n1. Creating checkout sessions...")
    session1 = processor.create_checkout_session("subscriber1@example.com", "monthly")
    session2 = processor.create_checkout_session("subscriber2@example.com", "yearly")
    
    # Demo: Process successful payments
    print("\n2. Processing successful payments...")
    subscriber1 = processor.process_successful_payment(session1)
    subscriber2 = processor.process_successful_payment(session2)
    
    # Demo: Handle subscription renewal
    print("\n3. Processing subscription renewal...")
    processor.handle_subscription_renewal(subscriber1.subscription_id, 5.00)
    
    # Demo: Generate analytics
    print("\n4. Generating analytics...")
    analytics = processor.get_subscriber_analytics()
    print(f"Total Revenue: ${analytics['total_revenue']:.2f}")
    print(f"Active Subscribers: {analytics['active_subscribers']}")
    
    # Demo: Generate report
    print("\n5. Generating revenue report...")
    report_file = processor.generate_revenue_report()
    
    print(f"\n✅ Payment processing demo completed!")
    print(f"📊 Revenue Report: {report_file}")

if __name__ == "__main__":
    main()
