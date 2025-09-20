'use client';

// Force dynamic rendering for about page
export const dynamic = "force-dynamic";

import React from 'react';
import { Users, Globe, Award, Heart, Music, Newspaper, Calendar, Star } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

const AboutPage = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', description: 'Across Jamaica and the diaspora' },
    { icon: Newspaper, value: '1000+', label: 'Articles Published', description: 'Daily news and updates' },
    { icon: Music, value: '500+', label: 'Featured Artists', description: 'From reggae legends to rising stars' },
    { icon: Calendar, value: '200+', label: 'Events Listed', description: 'Concerts, festivals, and cultural events' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'We stay true to Jamaican culture and values, providing genuine content that reflects the spirit of the island.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting Jamaicans worldwide while preserving and promoting our rich cultural heritage.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering high-quality content, accurate news, and exceptional user experiences.'
    },
    {
      icon: Star,
      title: 'Innovation',
      description: 'Embracing modern technology to bring Jamaica\'s culture to the digital age.'
    }
  ];

  const team = [
    {
      name: 'Marcus Johnson',
      role: 'Founder & CEO',
      bio: 'Born and raised in Kingston, Marcus has a deep passion for Jamaican culture and digital innovation.',
      image: '/images/placeholder-business.jpg'
    },
    {
      name: 'Aisha Thompson',
      role: 'Head of Content',
      bio: 'Award-winning journalist with 15+ years covering Caribbean culture and entertainment.',
      image: '/images/placeholder-business.jpg'
    },
    {
      name: 'David Clarke',
      role: 'Technical Director',
      bio: 'Tech enthusiast dedicated to building platforms that serve the Jamaican community.',
      image: '/images/placeholder-business.jpg'
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
            About <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">YaadFeed</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Jamaica's premier digital platform connecting the diaspora with the heartbeat of the island
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glamour" size="lg">
              Our Mission
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-logo-primary">
              Meet the Team
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              To be the digital bridge that connects Jamaicans worldwide, preserving our culture, 
              amplifying our voices, and celebrating our achievements on a global stage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Connecting the Jamaican Diaspora
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                YaadFeed was born from a simple idea: to create a digital home where Jamaicans 
                everywhere could stay connected to their roots, culture, and community.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're in Kingston, London, Toronto, or New York, we bring Jamaica to you 
                through authentic news, music, events, and cultural content that matters.
              </p>
              <Button variant="glamour">
                Learn More
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-logo-primary/20 to-logo-secondary/20 rounded-3xl p-8 shadow-soft">
                <div className="text-center">
                  <Heart className="w-20 h-20 text-logo-primary mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Jamaica to the World</h4>
                  <p className="text-gray-600">
                    Sharing our culture, music, and stories with the world while keeping 
                    the diaspora connected to home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              YaadFeed by the <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Numbers</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center soft-card p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-logo-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-gray-600 text-sm">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at YaadFeed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="soft-card p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/20 to-logo-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-logo-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Meet Our <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind YaadFeed's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="soft-card p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full mx-auto mb-6 shadow-soft overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-logo-primary font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-logo-primary via-logo-secondary to-logo-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-soft">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Join the YaadFeed Family
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Be part of the movement that's bringing Jamaica to the world and keeping 
              the diaspora connected to home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white/90 backdrop-blur-lg text-logo-primary hover:bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 text-xl font-bold px-8 py-4">
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-white/80 bg-white/10 backdrop-blur-lg text-white hover:bg-white hover:text-logo-primary shadow-soft text-xl font-bold px-8 py-4"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
