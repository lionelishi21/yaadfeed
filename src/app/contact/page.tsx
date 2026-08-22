'use client';

// Force dynamic rendering for contact page
export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { Mail, Clock, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 4000);
      } else {
        // Fallback: direct email link
        setError('Message could not be sent automatically. Please email us directly at info@yardvybz.news');
      }
    } catch {
      setError('Message could not be sent automatically. Please email us directly at info@yardvybz.news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'correction', label: 'Story Correction or Tip' },
    { value: 'content', label: 'Content Submission' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'advertising', label: 'Advertising' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-yard-dark">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative bg-yard-gray border-b border-[#1a1a1a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Get in <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {"We'd love to hear from you — story tips, corrections, partnerships, or just a hello."}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border border-[#222] bg-[#111] p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-yard-gold to-yellow-600 rounded-xl flex items-center justify-center mb-5">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
              <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline text-lg font-semibold">
                info@yardvybz.news
              </a>
              <p className="text-gray-400 text-sm mt-2">For editorial, advertising, and general inquiries</p>
            </div>

            <div className="border border-[#222] bg-[#111] p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-yard-gold to-yellow-600 rounded-xl flex items-center justify-center mb-5">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Response Times</h3>
              <p className="text-gray-300 font-semibold">General: within 48 hours</p>
              <p className="text-gray-300 font-semibold">Corrections: within 24 hours</p>
              <p className="text-gray-400 text-sm mt-2">Monday – Friday</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              Send us a <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Message</span>
            </h2>
            <p className="text-xl text-gray-400">
              {"Have a question, story tip, or correction? We're all ears."}
            </p>
          </div>
          
          <div className="border border-[#222] bg-[#111] p-8 lg:p-12">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-yard-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-gray-400 mb-4">
                  {"Thank you for reaching out. We'll get back to you as soon as possible."}
                </p>
                <p className="text-yard-gold font-semibold">— The YardVybz Editorial Team</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 p-4 border border-red-500/30 bg-red-500/10 rounded">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#333] bg-[#222] text-white rounded-xl focus:ring-2 focus:ring-yard-gold/30 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#333] bg-[#222] text-white rounded-xl focus:ring-2 focus:ring-yard-gold/30 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#333] bg-[#222] text-white rounded-xl focus:ring-2 focus:ring-yard-gold/30 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[#333] bg-[#222] text-white rounded-xl focus:ring-2 focus:ring-yard-gold/30 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-yard-gold text-yard-dark font-bold text-lg px-10 py-4 hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yard-dark"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-yard-dark border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "How do I report an error in an article?",
                answer: "Select 'Story Correction or Tip' in the contact form above, or email us at info@yardvybz.news. We take corrections seriously and will investigate and update the article within 24 hours if a factual error is confirmed."
              },
              {
                question: "Can I submit a story or press release to YardVybz?",
                answer: "Absolutely. We welcome story tips, press releases, and community submissions. Select 'Content Submission' in the form above. All submissions are reviewed by our editorial team before publication."
              },
              {
                question: "Do you offer advertising opportunities?",
                answer: "Yes — we offer display advertising and sponsored content options. Select 'Advertising' in the subject dropdown and we will send you our current media kit with rates and audience demographics."
              },
              {
                question: "How can I partner with YardVybz?",
                answer: "We're open to content partnerships, event partnerships, and community collaborations that align with our mission. Send us a message with 'Partnership' as the subject."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-[#222] bg-[#111] p-6">
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
