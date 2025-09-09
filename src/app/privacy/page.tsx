'use client';

import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Calendar, Settings, Mail } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Privacy Policy | YaadFeed</title>
        <meta name="description" content="Learn how YaadFeed collects, uses, and protects your data." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <ClientHeader />
      
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
    </>
  );
};

export default PrivacyPage;
