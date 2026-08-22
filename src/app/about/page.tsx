'use client';

// Force dynamic rendering for about page
export const dynamic = "force-dynamic";

import React from 'react';
import { Globe, Award, Heart, Music, Newspaper, Star } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Authenticity First',
      description: 'We stay true to Jamaican culture and values, publishing content that genuinely reflects the spirit, language, and lived experience of the island and its diaspora — not a sanitized, outsider-approved version of it.'
    },
    {
      icon: Globe,
      title: 'Global Diaspora Connection',
      description: 'With Jamaicans spread across the UK, Canada, the United States, and beyond, YardVybz serves as a digital bridge — keeping the diaspora plugged in to everything happening back home and celebrating Jamaican achievement worldwide.'
    },
    {
      icon: Award,
      title: 'Editorial Integrity',
      description: 'Every story we publish is reviewed for accuracy before it goes live. We correct errors promptly, cite our sources, and maintain a clear separation between news reporting and editorial opinion. Read our full Editorial Policy for details.'
    },
    {
      icon: Star,
      title: 'Culture Over Clickbait',
      description: "We reject sensationalism in favour of substance. Whether it's breaking political news from Kingston, an in-depth interview with a rising dancehall star, or a deep dive into Jamaica's Olympic legacy, we always lead with quality."
    }
  ];

  const coverageAreas = [
    { icon: Newspaper, title: 'News & Politics', desc: 'Comprehensive coverage of Jamaican national news, parliamentary developments, government policy, and the issues shaping daily life across the island.' },
    { icon: Music, title: 'Music & Entertainment', desc: 'From dancehall to reggae, soca to afrobeats with Caribbean crossover, we cover the artists, albums, events, and industry news that matter to fans worldwide.' },
    { icon: Globe, title: 'Diaspora Life', desc: 'Stories about Jamaican communities in the UK, USA, Canada, and beyond — celebrating achievements, addressing challenges, and keeping connections alive.' },
    { icon: Award, title: 'Sports', desc: 'Track and field, cricket, football, and more. Jamaica produces world-class athletes across disciplines, and we cover them with the depth their achievements deserve.' },
  ];

  return (
    <div className="min-h-screen bg-yard-dark">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-yard-gray border-b border-[#1a1a1a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">YardVybz</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {"Jamaica's premier digital platform connecting the diaspora with the heartbeat of the island"}
          </p>
        </div>
      </section>

      {/* Mission Section — substantive editorial content for E-E-A-T */}
      <section className="py-20 bg-yard-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white mb-8">
            Our <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Mission</span>
          </h2>
          
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              YardVybz was founded on a simple but powerful conviction: that Jamaicans around the world deserve a dedicated, trustworthy digital home where they can stay informed about everything happening in Jamaica — from political developments in Gordon House to the latest dancehall drops, from grassroots business innovation to the global success of Jamaican athletes on the world stage.
            </p>
            <p>
              Jamaica punches far above its weight on the global stage. A nation of under three million people has produced icons in music, sport, literature, and business — from Bob Marley and Usain Bolt to Louise Bennett and Michael Lee-Chin. Yet too often, international media coverage reduces Jamaica to a tourist destination or a source of music samples. YardVybz exists to change that narrative and give the full picture.
            </p>
            <p>
              We publish original reporting, analysis, and cultural commentary across categories including politics, business, sports, entertainment, music, and diaspora life. Our editorial team works to go beyond the headlines, providing the context and depth that our readers — whether they are in Kingston, London, Toronto, or New York — need to truly understand what is happening at home.
            </p>
            <p>
              We believe in the power of the Jamaican story told by people who genuinely know and love the culture. That is why we invest in original content rather than simply aggregating headlines from elsewhere. Every article on YardVybz is created or curated with the goal of being genuinely useful, informative, and worth your time.
            </p>
            <p>
              Our commitment extends to accuracy and transparency. We cite our sources, correct mistakes promptly, and clearly distinguish between news reporting and editorial opinion. We maintain a published{' '}
              <Link href="/editorial-policy" className="text-yard-gold underline hover:text-yellow-400 transition-colors">
                Editorial Policy
              </Link>{' '}
              that sets out our standards for sourcing, fact-checking, corrections, and editorial independence.
            </p>
            <p>
              Whether you are a second-generation Jamaican in Birmingham who wants to feel connected to your roots, a business professional tracking investment opportunities on the island, a music fan following the next generation of dancehall artists, or simply someone who loves everything Jamaican culture has to offer — YardVybz is built for you. We are proud to serve this community, and we take that responsibility seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-yard-dark border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">
              Our <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide every story we publish at YardVybz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="border border-[#222] bg-[#111] p-8">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-yard-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-20 bg-yard-dark border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white mb-8">
            What We <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Cover</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            {coverageAreas.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 p-6 border border-[#222] bg-[#111]">
                  <Icon className="w-6 h-6 text-yard-gold shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yard-dark via-[#111] to-yard-gray border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yard-dark/10 backdrop-blur-lg p-12 border border-white/10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Get Involved
            </h2>
            <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Have a story tip, a correction, or want to submit content? We would love to hear from the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-yard-gold text-yard-dark font-bold text-lg px-8 py-4 hover:bg-yellow-400 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/editorial-policy"
                className="inline-block border border-white/30 text-white font-bold text-lg px-8 py-4 hover:bg-white/5 transition-colors"
              >
                Editorial Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
