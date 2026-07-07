'use client';

// Force dynamic rendering for media-kit page
export const dynamic = "force-dynamic";

import React from 'react';
import { Download, Image as ImageIcon, FileText, Palette, Globe, Users, TrendingUp, Star } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

const MediaKitPage = () => {
  const brandAssets = [
    {
      name: 'YardVybz Logo (PNG)',
      description: 'High-resolution logo with transparent background',
      size: '2.4 MB',
      format: 'PNG',
      icon: ImageIcon
    },
    {
      name: 'YardVybz Logo (SVG)',
      description: 'Scalable vector logo for digital use',
      size: '45 KB',
      format: 'SVG',
      icon: ImageIcon
    },
    {
      name: 'Brand Guidelines',
      description: 'Complete brand style guide and usage rules',
      size: '3.1 MB',
      format: 'PDF',
      icon: FileText
    },
    {
      name: 'Color Palette',
      description: 'Official YardVybz color codes and combinations',
      size: '156 KB',
      format: 'PDF',
      icon: Palette
    }
  ];

  const platformStats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Users',
      description: 'Growing community across Jamaica and diaspora'
    },
    {
      icon: TrendingUp,
      value: '1M+',
      label: 'Monthly Views',
      description: 'Consistent traffic growth month over month'
    },
    {
      icon: Globe,
      value: '25+',
      label: 'Countries',
      description: 'Global reach with Jamaican culture focus'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'User Rating',
      description: 'Highly rated by our community'
    }
  ];

  const pressReleases = [
    {
      title: 'YardVybz Launches New Mobile App',
      date: '2024-01-15',
      summary: 'Revolutionary mobile experience for Jamaican news and culture'
    },
    {
      title: 'Partnership with Major Caribbean Media',
      date: '2023-12-10',
      summary: 'Expanding reach across the Caribbean region'
    },
    {
      title: 'Community Awards Recognition',
      date: '2023-11-20',
      summary: 'YardVybz honored for cultural preservation efforts'
    }
  ];

  const contactInfo = {
    press: 'press@yardvybz.news',
    marketing: 'marketing@yardvybz.news',
    general: 'info@yardvybz.news',
    phone: '+1 (876) 555-YAAD'
  };

  return (
    <div className="min-h-screen bg-yard-dark">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-yard-gray border-b border-[#1a1a1a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Media <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Kit</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Everything you need to tell the YardVybz story. Brand assets, statistics, and press information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glamour" size="lg">
              Download Media Kit
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-yard-dark hover:text-yard-gold">
              Contact Press Team
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-20 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">
              YardVybz by the <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Numbers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Key metrics and statistics that showcase our platform's growth and impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center border border-[#222] bg-[#111] p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-yard-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-yard-gold mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                  <div className="text-gray-400 text-sm">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">
              Brand <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Assets</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Download official YardVybz logos, brand guidelines, and design resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandAssets.map((asset, index) => {
              const IconComponent = asset.icon;
              return (
                <div key={index} className="border border-[#222] bg-[#111] p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-yard-gold" />
                    </div>
                    <div className="text-right">
                      <span className="bg-yard-gold text-yard-gold px-3 py-1 rounded-xl text-sm font-semibold">
                        {asset.format}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{asset.name}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{asset.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Size: {asset.size}</span>
                    <Button variant="glamour" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">
              Recent <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Press</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Latest announcements and press releases from YardVybz
            </p>
          </div>
          
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="border border-[#222] bg-[#111] p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{release.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{release.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Date: {new Date(release.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Read More
                    </Button>
                    <Button variant="glamour">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-yard-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border border-[#222] bg-[#111] p-12">
            <h2 className="text-4xl font-black text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Need additional information, interviews, or have specific media requests? 
              Our press team is here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Press Inquiries</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yard-gold font-semibold">Email:</span>
                    <a href={`mailto:${contactInfo.press}`} className="text-yard-gold hover:underline">
                      {contactInfo.press}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yard-gold font-semibold">Phone:</span>
                    <span>{contactInfo.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Marketing & Partnerships</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yard-gold font-semibold">Email:</span>
                    <a href={`mailto:${contactInfo.marketing}`} className="text-yard-gold hover:underline">
                      {contactInfo.marketing}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yard-gold font-semibold">General:</span>
                    <a href={`mailto:${contactInfo.general}`} className="text-yard-gold hover:underline">
                      {contactInfo.general}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glamour" size="lg">
                Schedule Interview
              </Button>
              <Button variant="outline">
                Request Press Kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MediaKitPage;
