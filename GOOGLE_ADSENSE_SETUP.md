# 🚀 Google AdSense Setup Guide for YaadFeed

## 📋 Prerequisites

1. **Google Account** - Must be 18+ years old
2. **Website Requirements**:
   - Original content (no duplicate content)
   - No copyright violations
   - Professional appearance
   - Mobile-friendly design
   - Privacy policy and terms of service
   - Contact information visible

## 🔧 Step-by-Step Setup

### Step 1: Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Click "Get Started"
3. Sign in with your Google account
4. Fill out the application:
   - Website URL: `https://your-domain.vercel.app`
   - Content language: English
   - Content category: News & Media
   - Business type: Individual or Business
   - Contact information
   - Payment information

### Step 2: Get Your AdSense Code

After approval (usually 1-2 weeks), you'll receive:
- **Publisher ID**: `ca-pub-1234567890123456`
- **Ad unit codes** for different ad formats

### Step 3: Update Environment Variables

Add to your `.env.local` file:
```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Step 4: Create Ad Units in AdSense

1. **Header Banner Ad**:
   - Format: Display
   - Size: Responsive
   - Name: Header Banner
   - Ad unit ID: `ca-pub-1234567890123456/header-banner`

2. **Sidebar Rectangle Ad**:
   - Format: Display
   - Size: 300x250
   - Name: Sidebar Rectangle
   - Ad unit ID: `ca-pub-1234567890123456/sidebar-rectangle`

3. **In-Article Ad**:
   - Format: Display
   - Size: Responsive
   - Name: In-Article
   - Ad unit ID: `ca-pub-1234567890123456/in-article`

4. **Multiplex Ad**:
   - Format: Display
   - Size: Responsive
   - Name: Multiplex
   - Ad unit ID: `ca-pub-1234567890123456/multiplex`

5. **Footer Banner Ad**:
   - Format: Display
   - Size: Responsive
   - Name: Footer Banner
   - Ad unit ID: `ca-pub-1234567890123456/footer-banner`

### Step 5: Update Ad Slot IDs

Replace the placeholder ad slot IDs in `src/components/ads/AdPlacements.tsx`:

```typescript
// Header Banner Ad
adSlot="ca-pub-1234567890123456/header-banner"

// Sidebar Rectangle Ad
adSlot="ca-pub-1234567890123456/sidebar-rectangle"

// In-Article Ad
adSlot="ca-pub-1234567890123456/in-article"

// Multiplex Ad
adSlot="ca-pub-1234567890123456/multiplex"

// Footer Banner Ad
adSlot="ca-pub-1234567890123456/footer-banner"
```

## 📱 Ad Placement Strategy

### Current Ad Placements:
1. **Header Banner** - Above navigation (high visibility)
2. **Sidebar Rectangle** - Right sidebar (consistent presence)
3. **In-Article** - After featured article (content engagement)
4. **Multiplex** - After articles grid (recommended content)
5. **Footer Banner** - Bottom of page (exit intent)
6. **Mobile Sticky** - Bottom mobile (mobile optimization)

### Recommended Additional Placements:
1. **Between Articles** - Every 3-4 articles
2. **Category Pages** - Top and bottom
3. **Artist Profile Pages** - Sidebar and content
4. **Event Pages** - Above and below content

## 🎯 Optimization Tips

### 1. Ad Placement Best Practices:
- **Above the fold** - Header banner gets highest visibility
- **Content integration** - In-article ads perform better
- **Mobile-first** - Ensure ads work on mobile devices
- **User experience** - Don't overwhelm with too many ads

### 2. Performance Optimization:
- **Lazy loading** - Load ads as they come into view
- **Responsive design** - Ads adapt to screen size
- **Ad blocker detection** - Handle blocked ads gracefully
- **Performance monitoring** - Track ad load times

### 3. Content Strategy:
- **High-quality content** - Better content = higher CPM
- **Regular updates** - Fresh content improves engagement
- **SEO optimization** - Better rankings = more traffic
- **Social sharing** - Increase reach and engagement

## 📊 Monitoring & Analytics

### 1. AdSense Dashboard Metrics:
- **Page RPM** - Revenue per 1000 page views
- **CTR** - Click-through rate
- **CPC** - Cost per click
- **Impressions** - Ad views
- **Earnings** - Daily/monthly revenue

### 2. Key Performance Indicators:
- **Page Views** - More views = more ad impressions
- **User Engagement** - Time on site, bounce rate
- **Traffic Sources** - Organic, social, referral
- **Device Breakdown** - Desktop vs mobile performance

### 3. A/B Testing:
- **Ad positions** - Test different placements
- **Ad formats** - Compare rectangle vs banner performance
- **Content types** - News vs entertainment performance
- **Page layouts** - Different ad configurations

## 🚨 Common Issues & Solutions

### Issue 1: Ads Not Showing
**Solution**: Check environment variables and ad slot IDs

### Issue 2: Low CTR
**Solution**: Optimize ad placement and content quality

### Issue 3: Policy Violations
**Solution**: Review AdSense policies and content guidelines

### Issue 4: Payment Issues
**Solution**: Verify payment information and tax details

## 📈 Revenue Optimization

### 1. Content Strategy:
- **Trending topics** - Cover current events and popular searches
- **Seasonal content** - Holidays, events, cultural celebrations
- **Local focus** - Jamaica-specific content performs better
- **Multimedia** - Videos, images, interactive content

### 2. Traffic Generation:
- **SEO optimization** - Target Jamaican news keywords
- **Social media** - Share on Jamaican community platforms
- **Email marketing** - Newsletter with ad-supported content
- **Partnerships** - Collaborate with Jamaican media outlets

### 3. User Experience:
- **Fast loading** - Optimize page speed for better engagement
- **Mobile optimization** - Ensure great mobile experience
- **Easy navigation** - Help users find more content
- **Engaging design** - Keep users on site longer

## 🔒 Compliance & Policies

### 1. AdSense Policies:
- **Content guidelines** - No adult content, violence, or hate speech
- **Traffic quality** - No artificial traffic or click farms
- **Ad placement** - Follow AdSense ad placement policies
- **User experience** - Don't interfere with site functionality

### 2. Legal Requirements:
- **Privacy policy** - Required for AdSense approval
- **Terms of service** - Protect your site and users
- **Cookie consent** - Comply with privacy regulations
- **Data protection** - Handle user data responsibly

## 📞 Support & Resources

### 1. Google AdSense Help:
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Community](https://support.google.com/adsense/community)
- [Policy Center](https://support.google.com/adsense/answer/48182)

### 2. YaadFeed Resources:
- Technical support: Check component files
- Content guidelines: Review news content standards
- Performance monitoring: Use debug endpoints

## 🎉 Next Steps

1. **Apply for AdSense** - Start the application process
2. **Prepare content** - Ensure high-quality, original content
3. **Set up environment** - Configure environment variables
4. **Test ads** - Verify ad display on development
5. **Deploy** - Push to Vercel for production
6. **Monitor** - Track performance and optimize

---

**Remember**: AdSense approval can take 1-2 weeks. Focus on creating quality content while waiting for approval. Once approved, start with conservative ad placement and gradually optimize based on performance data.

**Good luck with your AdSense journey! 🇯🇲**
