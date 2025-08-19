# YaadFeed Deployment & Setup Guide

## 🚀 Complete Deployment Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.12+
- Stripe account for payments
- Social media API keys (Instagram, Facebook, Twitter, YouTube)

### 1. Environment Setup

Create `.env.local` file in the yaadfeed directory:

```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Social Media APIs
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
FACEBOOK_ACCESS_TOKEN=your_facebook_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# AI Services
OPENAI_API_KEY=your_openai_key  # For content optimization
MINIMAX_API_KEY=your_minimax_key  # For video generation

# Newsletter Configuration
NEWSLETTER_WEBHOOK_URL=https://your-domain.com/api/newsletter/webhook
```

### 2. Web Application Deployment

#### Local Development
```bash
cd yaadfeed
npm install
npm run dev
```

#### Production Deployment (Vercel)
```bash
# Deploy to Vercel
npm run build
vercel --prod

# Or deploy via Vercel dashboard by connecting GitHub repo
```

### 3. Database Setup (Supabase)

Create the following tables in Supabase:

```sql
-- Subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active',
  plan_id VARCHAR(100),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  next_billing_date TIMESTAMP,
  trial_end TIMESTAMP,
  metadata JSONB
);

-- News articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  optimized_headline TEXT,
  content TEXT,
  summary TEXT,
  url TEXT,
  published TIMESTAMP,
  category VARCHAR(50),
  source VARCHAR(100),
  keywords TEXT[],
  trending_score DECIMAL(3,2),
  social_media_posts JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Artist profiles table
CREATE TABLE artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  genre VARCHAR(100),
  net_worth BIGINT,
  followers_count INT,
  social_media_links JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP,
  venue VARCHAR(255),
  location VARCHAR(255),
  price DECIMAL(10,2),
  category VARCHAR(100),
  artist_id UUID REFERENCES artists(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Automation Setup

#### Install Python Dependencies
```bash
cd automation
python -m pip install -r requirements.txt
```

Create `requirements.txt`:
```
schedule==1.2.0
feedparser==6.0.10
requests==2.31.0
python-dotenv==1.0.0
stripe==7.8.0
asyncio==3.4.3
```

#### Configure Automation Services

1. **Content Optimization Service**
   ```bash
   python ai_content_optimizer.py
   ```

2. **Video Generation Service**
   ```bash
   python video_generator.py
   ```

3. **Social Media Automation**
   ```bash
   python social_media_automation.py
   ```

4. **Payment Processing**
   ```bash
   python payment_processor.py
   ```

5. **Complete Orchestrator**
   ```bash
   python automation_orchestrator.py
   ```

### 5. Stripe Webhook Configuration

Set up Stripe webhooks to handle subscription events:

**Webhook URL**: `https://your-domain.com/api/stripe/webhook`

**Events to listen for**:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 6. Social Media API Setup

#### Instagram Business API
1. Create Facebook App
2. Add Instagram Basic Display API
3. Generate access tokens
4. Configure webhook endpoints

#### YouTube Data API
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure redirect URIs

#### Twitter API v2
1. Create Twitter Developer Account
2. Create new App
3. Generate API keys and tokens
4. Configure webhook URLs

### 7. Production Monitoring

#### Health Check Endpoints
- `GET /api/health` - Application health
- `GET /api/automation/status` - Automation status
- `GET /api/stripe/status` - Payment system status

#### Logging Configuration
```javascript
// Add to next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    logging: 'verbose',
  },
}
```

### 8. Performance Optimization

#### CDN Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

#### Caching Strategy
- Static content: 1 year cache
- API responses: 5 minutes cache
- News content: 1 hour cache
- Artist profiles: 24 hours cache

### 9. Security Configuration

#### Environment Variables
```bash
# Production security
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com
```

#### Content Security Policy
```javascript
// Add to next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
]
```

### 10. Automation Scheduling

#### Production Cron Jobs
```bash
# Add to crontab for automated execution
0 6 * * * cd /path/to/yaadfeed/automation && python automation_orchestrator.py
0 */2 * * * cd /path/to/yaadfeed/automation && python ai_content_optimizer.py
0 */4 * * * cd /path/to/yaadfeed/automation && python social_media_automation.py
```

### 11. Backup & Recovery

#### Database Backups
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Code Deployment
```bash
# Blue-green deployment
git checkout main
git pull origin main
npm run build
vercel --prod
```

### 12. Monitoring & Analytics

#### Error Tracking
- Sentry for error monitoring
- LogRocket for user session recording
- Google Analytics for traffic analysis

#### Performance Monitoring
- Vercel Analytics for Core Web Vitals
- Stripe Dashboard for payment metrics
- Social media native analytics

## 🎯 Launch Checklist

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Stripe webhook endpoints configured
- [ ] Social media APIs connected
- [ ] Automation services tested
- [ ] Payment processing verified
- [ ] Content optimization working
- [ ] Video generation configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] SEO optimization complete
- [ ] Mobile responsiveness tested
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] Backup systems in place
- [ ] Monitoring tools setup

## 🚨 Troubleshooting

### Common Issues

1. **Stripe Webhook Failures**
   - Verify webhook URL is accessible
   - Check webhook signing secret
   - Validate SSL certificate

2. **Social Media API Errors**
   - Confirm API keys are valid
   - Check rate limiting
   - Verify app permissions

3. **Database Connection Issues**
   - Validate Supabase credentials
   - Check network connectivity
   - Verify SSL requirements

4. **Automation Failures**
   - Check Python dependencies
   - Validate cron job configuration
   - Review log files for errors

### Support Resources
- Stripe Documentation: https://stripe.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Platform: https://vercel.com/docs

---

**YaadFeed is now ready for production!** 🇯🇲

For technical support, check the logs in `/automation/logs/` directory.
