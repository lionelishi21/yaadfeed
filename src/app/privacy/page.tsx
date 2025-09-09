import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | YaadFeed',
  description: 'Learn how YaadFeed collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-6 text-gray-800 leading-7">
        <p>
          This Privacy Policy explains how YaadFeed ("we", "us", or "our") collects, uses,
          discloses, and safeguards your information when you use our website, mobile site, and
          related services (collectively, the "Services"). By using the Services, you consent to
          our practices described in this Policy.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Personal Information</span>: Such as name, email address, and any
            information you provide when you contact us or create an account (if applicable).
          </li>
          <li>
            <span className="font-medium">Usage Data</span>: Pages viewed, links clicked, referring/exit pages,
            and other activity on the Services.
          </li>
          <li>
            <span className="font-medium">Device and Log Information</span>: IP address, browser type, operating
            system, device identifiers, and access times.
          </li>
          <li>
            <span className="font-medium">Cookies and Similar Technologies</span>: We use cookies, web beacons,
            and similar technologies to improve and personalize your experience.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve the Services.</li>
          <li>Personalize content and remember your preferences.</li>
          <li>Monitor and analyze usage and trends.</li>
          <li>Communicate with you, including responding to inquiries.</li>
          <li>Detect, prevent, and address technical or security issues.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Advertising, Analytics, and Cookies</h2>
        <p>
          We may use third-party advertising and analytics partners, including Google AdSense and
          Google Analytics. These partners may set cookies or use similar technologies to collect
          information about your use of the Services and other websites. You can learn more about
          how Google uses data from partners at
          <span className="whitespace-pre"> </span>
          <a className="text-teal-600 underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google Policies</a>.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect some
          features of the Services.
        </p>

        <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
        <p>
          We may share information with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Service providers who assist in operating the Services.</li>
          <li>Analytics and advertising partners as described above.</li>
          <li>Authorities or third parties if required by law or to protect rights and safety.</li>
          <li>In connection with a merger, sale, or asset transfer.</li>
        </ul>

        <h2 className="text-xl font-semibold">5. Data Retention</h2>
        <p>
          We retain information for as long as necessary to fulfill the purposes outlined in this
          Policy unless a longer retention period is required or permitted by law.
        </p>

        <h2 className="text-xl font-semibold">6. Your Choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Opt-out of marketing emails by following the unsubscribe link in messages.</li>
          <li>Adjust cookie settings in your browser.</li>
          <li>Request access, correction, or deletion of your personal information where applicable.</li>
        </ul>

        <h2 className="text-xl font-semibold">7. Data Security</h2>
        <p>
          We use reasonable administrative, technical, and physical safeguards to protect your
          information. However, no method of transmission or storage is completely secure.
        </p>

        <h2 className="text-xl font-semibold">8. International Users</h2>
        <p>
          If you access the Services from outside your country, you understand that your information
          may be processed and stored in jurisdictions that may have data protection laws different
          from your own.
        </p>

        <h2 className="text-xl font-semibold">9. Children’s Privacy</h2>
        <p>
          The Services are not directed to children under 13, and we do not knowingly collect
          personal information from children under 13.
        </p>

        <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The updated Policy will be posted on
          this page with a new “Last updated” date. Your continued use of the Services indicates your
          acceptance of the updated Policy.
        </p>

        <h2 className="text-xl font-semibold">11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices, contact us at
          <span className="whitespace-pre"> </span>
          <a className="text-teal-600 underline" href="mailto:privacy@yaadfeed.com">privacy@yaadfeed.com</a>.
        </p>
      </section>
    </div>
  );
}

'use client';

import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Calendar, Settings, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

const PrivacyPage = () => {
  const lastUpdated = 'January 15, 2024';

  const privacyPrinciples = [
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'We implement industry-standard security measures to protect your personal information.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We\'re clear about what data we collect, how we use it, and who we share it with.'
    },
    {
      icon: Lock,
      title: 'User Control',
      description: 'You have full control over your data and can request deletion at any time.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Your privacy is essential to building a trusted community platform.'
    }
  ];

  const dataCollection = [
    {
      category: 'Account Information',
      examples: ['Name, email address, profile picture', 'Authentication credentials', 'Account preferences and settings'],
      purpose: 'To provide personalized services and maintain your account'
    },
    {
      category: 'Usage Data',
      examples: ['Pages visited, articles read', 'Search queries and interactions', 'Device and browser information'],
      purpose: 'To improve our services and provide relevant content'
    },
    {
      category: 'Content',
      examples: ['Comments, posts, and submissions', 'User-generated content', 'Feedback and communications'],
      purpose: 'To enable community features and content moderation'
    }
  ];

  const dataSharing = [
    {
      title: 'We Never Share',
      items: ['Personal information with advertisers', 'Your data with third-party marketers', 'Individual user data without consent']
    },
    {
      title: 'We May Share',
      items: ['Aggregated, anonymized statistics', 'Information required by law enforcement', 'Data with your explicit consent']
    }
  ];

  const userRights = [
    'Access your personal data',
    'Correct inaccurate information',
    'Request deletion of your data',
    'Export your data',
    'Opt-out of marketing communications',
    'Control privacy settings'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Privacy <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            How we protect and respect your privacy on YaadFeed
          </p>
          <div className="flex items-center justify-center gap-4 text-white/80">
            <Calendar className="w-5 h-5" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Our Privacy <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Principles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fundamental principles that guide how we handle your personal information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {privacyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className="soft-card p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/20 to-logo-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-logo-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{principle.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              What Data We <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Collect</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent information about the data we collect and why we need it
            </p>
          </div>
          
          <div className="space-y-8">
            {dataCollection.map((item, index) => (
              <div key={index} className="soft-card p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.category}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-logo-primary mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {item.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-logo-primary rounded-full mt-2 flex-shrink-0"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-logo-primary mb-3">Purpose:</h4>
                    <p className="text-gray-600">{item.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              How We <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Share</span> Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear guidelines on when and how your data might be shared
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataSharing.map((section, index) => (
              <div key={index} className="soft-card p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        section.title === 'We Never Share' ? 'bg-red-500' : 'bg-logo-primary'
                      }`}></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Your <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Rights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You have complete control over your personal information
            </p>
          </div>
          
          <div className="soft-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRights.map((right, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-logo-primary rounded-full"></div>
                  <span className="text-gray-700 font-medium">{right}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                To exercise any of these rights, contact us using the information below.
              </p>
              <Button variant="glamour">
                Contact Privacy Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Updates */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="soft-card p-12">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our privacy team is here to help with any questions about how we handle your data
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Inquiries</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-logo-primary" />
                    <a href="mailto:privacy@yaadfeed.com" className="text-logo-primary hover:underline">
                      privacy@yaadfeed.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-logo-primary" />
                    <span>Privacy Settings in your account dashboard</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Updates</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-logo-primary" />
                    <span>Last updated: {lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-logo-primary" />
                    <span>We'll notify you of any significant changes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glamour" size="lg">
                Update Privacy Settings
              </Button>
              <Button variant="outline">
                Download Full Policy
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
