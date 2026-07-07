'use client';

// Force dynamic rendering for cookies page
export const dynamic = "force-dynamic";

import React from 'react';
import { Settings, Shield, Globe, Lock } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Head from 'next/head';

const CookiesPage = () => {
  const lastUpdated = 'July 7, 2026';

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'These cookies are strictly necessary to provide you with services available through our website and to use some of its features.',
      examples: ['Authentication cookies', 'Security cookies', 'Session management']
    },
    {
      icon: Settings,
      title: 'Functionality Cookies',
      description: 'These cookies are used to remember choices you make when you use our website, such as remembering your login details or language preference.',
      examples: ['User preferences', 'Language settings', 'Theme settings']
    },
    {
      icon: Globe,
      title: 'Analytics & Performance',
      description: 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.',
      examples: ['Page views', 'Traffic sources', 'User behavior']
    },
    {
      icon: Lock,
      title: 'Advertising Cookies',
      description: 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.',
      examples: ['Targeted ads', 'Ad delivery', 'Conversion tracking']
    }
  ];

  return (
    <>
      <Head>
        <title>Cookie Policy | YardVybz</title>
        <meta name="description" content="Learn about how YardVybz uses cookies and similar technologies on our platform." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Cookie <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            How we use cookies to improve your experience on YardVybz
          </p>
          <div className="flex items-center justify-center gap-4 text-white/80">
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Intro text */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What Are Cookies?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device by websites that you visit. 
            They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Types of <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Cookies</span> We Use
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((cookie, index) => {
              const IconComponent = cookie.icon;
              return (
                <div key={index} className="soft-card p-8 bg-white rounded-xl shadow-soft">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/20 to-logo-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-logo-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{cookie.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{cookie.description}</p>
                  <div>
                    <strong className="text-gray-900 text-sm">Examples:</strong>
                    <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
                      {cookie.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Managing Cookies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Managing Your Cookie Preferences
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            You can change your cookie preferences at any time. Most web browsers allow some control of most cookies through the browser settings.
          </p>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noreferrer" className="text-logo-primary underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-logo-primary underline">www.allaboutcookies.org</a>.
          </p>
          
          <div className="flex justify-center mt-8">
            <Button variant="glamour" size="lg">
              Update Cookie Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            If you have any questions about our use of cookies, please contact us at <a href="mailto:info@yardvybz.news" className="text-logo-primary font-semibold">info@yardvybz.news</a>.
          </p>
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default CookiesPage;
