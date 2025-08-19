export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Globe, 
  MapPin, 
  Star, 
  BarChart3, 
  Eye, 
  ArrowRight,
  CheckCircle,
  Zap,
  Heart
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Advertise with YaadFeed | Reach Jamaica\'s Digital Community',
  description: 'Partner with YaadFeed to promote your business to Jamaica\'s most engaged digital audience. Premium advertising solutions for authentic Jamaican businesses.',
  keywords: 'Jamaica advertising, digital marketing, Caribbean marketing, Jamaican audience, YaadFeed advertising',
};

const AdvertisePage = () => {
  const stats = [
    { label: 'Monthly Visitors', value: '250K+', icon: Users, color: 'text-blue-600' },
    { label: 'Engagement Rate', value: '85%', icon: Heart, color: 'text-red-500' },
    { label: 'Return Visitors', value: '65%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Average Session', value: '8 min', icon: Eye, color: 'text-purple-600' }
  ];

  const adPlacements = [
    {
      name: 'Featured Partner Spotlight',
      description: 'Premium placement in our Featured Partners section on the homepage',
      price: '$299/month',
      features: [
        'Large card format with image',
        'Prime homepage placement',
        'Contact information included',
        'Click tracking & analytics',
        'Social media integration'
      ],
      popular: true
    },
    {
      name: 'Homepage Display Ad',
      description: 'Smaller format ads displayed alongside other partners',
      price: '$149/month',
      features: [
        'Compact card format',
        'Homepage visibility',
        'Basic contact info',
        'Click tracking',
        'Category classification'
      ],
      popular: false
    },
    {
      name: 'Article Sidebar',
      description: 'Targeted ads displayed alongside news articles',
      price: '$199/month',
      features: [
        'Contextual placement',
        'High engagement rates',
        'Category targeting',
        'Analytics dashboard',
        'A/B testing support'
      ],
      popular: false
    },
    {
      name: 'Newsletter Sponsorship',
      description: 'Exclusive sponsorship of our weekly newsletter',
      price: '$399/month',
      features: [
        'Direct inbox access',
        'Exclusive positioning',
        'Newsletter branding',
        'Subscriber analytics',
        'Content collaboration'
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Targeted Audience',
      description: 'Reach Jamaicans and Caribbean diaspora who are actively engaged with authentic content.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with Jamaica-focused audience worldwide, from Kingston to Brooklyn to London.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive reporting on impressions, clicks, and engagement metrics.'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Get your ad live within 24 hours of approval. Simple process, maximum impact.'
    }
  ];

  const testimonials = [
    {
      name: 'Marcus Brown',
      company: 'Island Spice Company',
      quote: 'YaadFeed helped us reach authentic Jamaican food lovers worldwide. Our online sales increased 300% in 3 months.',
      rating: 5
    },
    {
      name: 'Sarah Williams',
      company: 'Blue Mountain Tours',
      quote: 'The targeted audience and engagement quality is exceptional. Best ROI we\'ve seen from any advertising platform.',
      rating: 5
    },
    {
      name: 'Devon Campbell',
      company: 'Reggae Heritage Studio',
      quote: 'Perfect platform to connect with people who genuinely appreciate Jamaican culture and music.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-jamaica-green-600 via-jamaica-gold-500 to-jamaica-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Reach Jamaica's
                <span className="block text-jamaica-gold-300">Digital Community</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                Partner with YaadFeed to promote your business to the most engaged 
                Jamaican audience online. Authentic connections, real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-jamaica-green-600 hover:bg-gray-100">
                  Start Advertising
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-jamaica-green-600"
                >
                  View Media Kit
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
                <Image
                  src="/images/jamaica-flag-bg.jpg"
                  alt="Jamaica Digital Community"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Advertise with YaadFeed?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join successful businesses reaching Jamaica's most engaged digital audience
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg ${stat.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Placements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Advertising Solutions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the perfect placement to showcase your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adPlacements.map((placement, index) => (
              <Card 
                key={placement.name} 
                className={`relative p-8 hover:shadow-xl transition-all duration-300 ${placement.popular ? 'ring-2 ring-jamaica-green-500' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {placement.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-jamaica-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{placement.name}</h3>
                  <p className="text-gray-600 mb-4">{placement.description}</p>
                  <div className="text-4xl font-bold text-jamaica-green-600 mb-4">
                    {placement.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {placement.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-jamaica-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${placement.popular ? 'bg-jamaica-green-600 hover:bg-jamaica-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose YaadFeed?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.title} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-jamaica-green-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-jamaica-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 text-lg">
              See how businesses are growing with YaadFeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="p-6 text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-jamaica-gold-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Reach Jamaica's Digital Community?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join successful businesses already advertising with YaadFeed. 
            Get started today and see results within your first month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button className="bg-white text-jamaica-green-600 hover:bg-gray-100 flex-1">
              Start Advertising
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-jamaica-green-600 flex-1">
              Contact Sales
            </Button>
          </div>
          <p className="text-white/80 text-sm mt-6">
            Questions? Email us at advertise@yaadfeed.com or call +1-876-555-YAAD
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdvertisePage; 