'use client';

// Force dynamic rendering for privacy page
export const dynamic = "force-dynamic";

import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Calendar, Settings, Mail, Cookie } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';

const PrivacyPage = () => {
  const lastUpdated = 'August 22, 2026';

  return (
    <div className="min-h-screen bg-yard-dark">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-yard-gray border-b border-[#1a1a1a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Privacy <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xl text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
            How YardVybz collects, uses, and protects your personal information
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Introduction</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                YardVybz ("we", "our", or "us") operates the website <strong className="text-white">yardvybz.news</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, create an account, read articles, leave comments, or interact with our services.
              </p>
              <p>
                By using YardVybz, you consent to the practices described in this policy. If you do not agree with this policy, please do not use our website. We may update this policy periodically — the "Last updated" date at the top of this page reflects the most recent revision, and we encourage you to review it regularly.
              </p>
            </div>
          </div>

          {/* What We Collect */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="border border-[#222] bg-[#111] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-yard-gold" />
                  <h3 className="text-xl font-bold text-white">Account Information</h3>
                </div>
                <p className="text-gray-400 mb-3">When you register for a YardVybz account, we collect:</p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Your name and email address</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Your chosen username and encrypted password</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Profile information you choose to provide (profile photo, bio)</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> OAuth tokens if you sign in with Google or Apple</li>
                </ul>
              </div>

              <div className="border border-[#222] bg-[#111] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-yard-gold" />
                  <h3 className="text-xl font-bold text-white">Usage Data</h3>
                </div>
                <p className="text-gray-400 mb-3">When you browse our site, we automatically collect:</p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Pages visited, articles read, and time spent on each page</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Referral source (how you arrived at our site)</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Browser type, device type, and operating system</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> IP address (anonymised for analytics purposes)</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> Search queries entered on our site</li>
                </ul>
              </div>

              <div className="border border-[#222] bg-[#111] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="w-6 h-6 text-yard-gold" />
                  <h3 className="text-xl font-bold text-white">Cookies & Tracking Technologies</h3>
                </div>
                <p className="text-gray-400 mb-3">
                  We use cookies and similar tracking technologies to improve your experience, remember your preferences, and serve relevant advertising. These include:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> <strong className="text-gray-300">Essential cookies:</strong> Required for the site to function (e.g., login sessions, CSRF protection)</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> <strong className="text-gray-300">Analytics cookies:</strong> Google Analytics to understand how visitors use our site (anonymised)</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> <strong className="text-gray-300">Advertising cookies:</strong> Google AdSense and partner networks to serve relevant ads. These networks may use cookies to personalise ads based on your browsing history.</li>
                  <li className="flex items-start gap-2"><span className="text-yard-gold mt-1.5">•</span> <strong className="text-gray-300">Preference cookies:</strong> Remembering your site settings and reading history</li>
                </ul>
                <p className="text-gray-400 mt-4">
                  You can manage cookies through your browser settings or through our cookie consent banner. Note that disabling certain cookies may limit site functionality.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use It */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">How We Use Your Information</h2>
            <div className="border border-[#222] bg-[#111] p-6 space-y-3 text-gray-400">
              <p>We use the information we collect to:</p>
              <ul className="space-y-2 mt-3">
                {[
                  'Provide, operate, and improve YardVybz and its features',
                  'Personalise the content and articles shown to you based on your reading history',
                  'Send you email newsletters if you have subscribed (with easy unsubscribe)',
                  'Respond to your messages, support requests, and editorial inquiries',
                  'Detect, prevent, and address technical issues and abuse',
                  'Comply with legal obligations and enforce our Terms of Service',
                  'Analyse aggregated usage trends to improve our editorial and product strategy',
                  'Serve contextually relevant advertising through Google AdSense and partner networks',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yard-gold mt-1.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Advertising */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Advertising & Third-Party Partners</h2>
            <div className="border border-[#222] bg-[#111] p-6 space-y-4 text-gray-400">
              <p>
                YardVybz is supported by advertising revenue. We work with Google AdSense and other advertising partners to display ads on our site. These partners may use cookies and similar technologies to serve ads based on your previous visits to our site and other sites on the internet.
              </p>
              <p>
                <strong className="text-gray-300">Google AdSense:</strong> Google uses the DoubleClick cookie to serve ads based on a user's prior visits to our website or other websites. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-yard-gold hover:underline">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-yard-gold hover:underline">aboutads.info</a>.
              </p>
              <p>
                We do not sell your personal data to advertisers. Ad partners receive anonymised or aggregated data only.
              </p>
            </div>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Data Sharing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-red-900/40 bg-red-900/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">We Never Share</h3>
                <ul className="space-y-2 text-gray-400">
                  {['Your personal data with advertisers for direct marketing', 'Your email address with third-party marketers', 'Individual user data without your explicit consent', 'Data in ways not described in this policy'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1.5">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-[#222] bg-[#111] p-6">
                <h3 className="text-xl font-bold text-white mb-4">We May Share</h3>
                <ul className="space-y-2 text-gray-400">
                  {['Aggregated, anonymised site analytics', 'Information required by law or a valid legal order', 'Data with service providers acting on our behalf (e.g., hosting, email delivery)', 'Data in the event of a merger or acquisition (with notice to users)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yard-gold mt-1.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Your Rights</h2>
            <div className="border border-[#222] bg-[#111] p-6">
              <p className="text-gray-400 mb-6">
                Depending on your location, you may have certain rights under applicable privacy laws including GDPR (European users) and CCPA (California users):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Access the personal data we hold about you',
                  'Correct inaccurate or incomplete information',
                  'Request deletion ("right to be forgotten") of your data',
                  'Export a copy of your data in a portable format',
                  'Opt out of personalised advertising',
                  'Withdraw consent for optional data processing',
                  'Lodge a complaint with your local data protection authority',
                  'Opt out of marketing emails at any time',
                ].map((right, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-yard-gold rounded-full shrink-0"></div>
                    <span className="text-gray-300 text-sm">{right}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#222]">
                <p className="text-gray-400 text-sm">
                  To exercise any of these rights, email us at{' '}
                  <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline">info@yardvybz.news</a>.
                  We will respond within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Data Security</h2>
            <div className="border border-[#222] bg-[#111] p-6 text-gray-400 space-y-4">
              <p>
                We implement industry-standard security measures to protect your personal information, including encrypted data transmission (HTTPS/TLS), hashed password storage, and access controls that restrict who within our organisation can access user data.
              </p>
              <p>
                While we take data security seriously, no method of internet transmission or electronic storage is 100% secure. If you discover a security vulnerability, please disclose it responsibly by emailing <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline">info@yardvybz.news</a>.
              </p>
            </div>
          </div>

          {/* Children */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Children's Privacy</h2>
            <div className="border border-[#222] bg-[#111] p-6 text-gray-400">
              <p>
                YardVybz is not directed at children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at{' '}
                <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline">info@yardvybz.news</a>{' '}
                and we will delete it promptly.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Contact & Policy Updates</h2>
            <div className="border border-[#222] bg-[#111] p-6 space-y-4 text-gray-400">
              <p>
                For any questions about this Privacy Policy, to exercise your rights, or to report a data concern, please contact us:
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yard-gold" />
                <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline font-semibold">info@yardvybz.news</a>
              </div>
              <p className="text-sm">
                We will notify you of any significant changes to this policy via email (if you are registered) or via a prominent notice on our website. The "Last updated" date above always reflects the most current version.
              </p>
              <p className="text-sm">
                This policy was last updated on <strong className="text-gray-300">{lastUpdated}</strong>.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
