'use client';

// Force dynamic rendering for help page
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Search, HelpCircle, MessageCircle, BookOpen, Shield, Users, Settings, Mail } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Topics', icon: HelpCircle },
    { value: 'account', label: 'Account & Settings', icon: Settings },
    { value: 'content', label: 'Content & News', icon: BookOpen },
    { value: 'community', label: 'Community', icon: Users },
    { value: 'privacy', label: 'Privacy & Security', icon: Shield },
    { value: 'technical', label: 'Technical Issues', icon: Settings }
  ];

  const faqs = [
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the "Sign Up" button in the top navigation. You can sign up using your email address or through social media accounts like Google or Facebook.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email.'
    },
    {
      category: 'content',
      question: 'How do I submit news or content?',
      answer: 'We welcome content submissions from our community! Use the contact form and select "Content Submission" as your subject. Our editorial team will review your submission and get back to you within 48 hours.'
    },
    {
      category: 'content',
      question: 'How often is content updated?',
      answer: 'We publish new content daily, with breaking news updates throughout the day. Our team works around the clock to bring you the latest news from Jamaica and the diaspora.'
    },
    {
      category: 'community',
      question: 'How can I connect with other users?',
      answer: 'You can interact with other users through comments on articles, participate in community discussions, and follow other users to see their activity. We encourage respectful and constructive dialogue.'
    },
    {
      category: 'privacy',
      question: 'How do you protect my privacy?',
      answer: 'We take your privacy seriously. We never sell your personal information to third parties. You can control your privacy settings in your account dashboard and request deletion of your data at any time.'
    },
    {
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. If the issue persists, please contact our support team with details about your device and browser.'
    },
    {
      category: 'technical',
      question: 'I can\'t see images or videos. How do I fix this?',
      answer: 'This is usually caused by ad blockers or browser extensions. Try disabling your ad blocker for our site, or whitelist yaadfeed.com. You can also try opening the site in an incognito/private window.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (searchQuery && !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@yaadfeed.com'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      href: '#'
    },
    {
      icon: HelpCircle,
      title: 'Community Forum',
      description: 'Get help from other community members',
      action: 'Visit Forum',
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Help <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, and guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Browse by <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-lg text-gray-600">
              Find help organized by topic
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-6 rounded-2xl transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-logo-primary to-logo-secondary text-white shadow-soft'
                      : 'bg-white hover:bg-logo-light/50 text-gray-700 hover:text-logo-primary shadow-soft hover:shadow-soft-lg'
                  }`}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm font-semibold">{category.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div key={index} className="soft-card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse by category
                </p>
                <Button 
                  variant="glamour"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Still Need <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Help?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our support team is here to help you with any questions or issues
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="text-center soft-card p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                  <p className="text-gray-600 mb-6">{method.description}</p>
                  <a href={method.href}>
                    <Button variant="glamour" className="w-full">
                      {method.action}
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-logo-primary via-logo-secondary to-logo-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-soft">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Let us know what you need help with. We're constantly improving our help center 
              based on user feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white/90 backdrop-blur-lg text-logo-primary hover:bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 text-xl font-bold px-8 py-4">
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                className="border-white/80 bg-white/10 backdrop-blur-lg text-white hover:bg-white hover:text-logo-primary shadow-soft text-xl font-bold px-8 py-4"
              >
                Give Feedback
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpPage;
