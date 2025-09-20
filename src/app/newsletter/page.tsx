'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { Check, Mail, Star, Users, Zap, Shield, X } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { validators } from '@/utils';

const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const features = [
    {
      icon: Mail,
      title: 'Weekly Newsletter',
      description: 'Curated content delivered every Friday with the best stories of the week'
    },
    {
      icon: Star,
      title: 'Exclusive Interviews',
      description: 'Behind-the-scenes content and interviews with top Jamaican artists'
    },
    {
      icon: Zap,
      title: 'Breaking News',
      description: 'Be the first to know about major developments in Jamaican music and culture'
    },
    {
      icon: Users,
      title: 'Event Access',
      description: 'Early bird tickets and exclusive access to concerts and cultural events'
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      location: 'Kingston, Jamaica',
      quote: 'YaadFeed keeps me connected to the culture. Best investment I\'ve made!',
      rating: 5
    },
    {
      name: 'Sarah Williams',
      location: 'Toronto, Canada',
      quote: 'As part of the diaspora, this newsletter helps me stay close to home.',
      rating: 5
    },
    {
      name: 'David Brown',
      location: 'London, UK',
      quote: 'Professional journalism with authentic Jamaican perspective. Love it!',
      rating: 5
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!validators.email(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (!firstName.trim()) {
      setError('Please enter your first name');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen">
        <ClientHeader />
        <div className="min-h-screen bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <div className="w-16 h-16 bg-jamaica-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to YaadFeed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing, {firstName}! You'll receive your first newsletter this Friday.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="w-full">
              Continue Exploring
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Stay Connected with Jamaica
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of readers who get exclusive access to the best of Jamaican news, 
            music, and culture delivered directly to their inbox.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block">
            <div className="text-3xl font-bold mb-2">$5/month</div>
            <div className="text-white/80">Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Get
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our premium newsletter offers exclusive content and insights you won't find anywhere else
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Form */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Subscribe Today
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  className="w-full py-3 text-lg"
                  size="lg"
                >
                  Subscribe for $5/month
                </Button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment • Cancel anytime • No hidden fees</span>
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose YaadFeed Premium?
              </h3>
              
              <div className="space-y-4">
                {[
                  'Ad-free reading experience',
                  'Exclusive artist interviews and features',
                  'Early access to event announcements',
                  'Premium news analysis and insights',
                  'Member-only community discussions',
                  'Archive access to all past content'
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-jamaica-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Subscribers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Join the community of satisfied readers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-jamaica-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or penalties.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards including Visa, Mastercard, and American Express through our secure payment processor.'
              },
              {
                question: 'How often will I receive the newsletter?',
                answer: 'Premium subscribers receive our main newsletter every Friday, plus breaking news alerts for major stories throughout the week.'
              },
              {
                question: 'Is there a free trial available?',
                answer: 'We offer a 7-day free trial for new subscribers. You can cancel before the trial ends without being charged.'
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsletterPage;
