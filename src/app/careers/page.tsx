'use client';

// Force dynamic rendering for careers page
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Users, MapPin, Clock, DollarSign, Heart, Zap, Award, Globe, Briefcase, Send, CheckCircle } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'content', label: 'Content & Editorial' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales & Partnerships' },
    { value: 'operations', label: 'Operations' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'kingston', label: 'Kingston, Jamaica' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'hybrid',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$80K - $120K',
      description: 'Join our engineering team to build the next generation of digital experiences for the Jamaican diaspora.',
      requirements: [
        'React/Next.js expertise',
        'TypeScript proficiency',
        'Tailwind CSS experience',
        'Passion for Jamaican culture'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work options',
        'Professional development'
      ]
    },
    {
      id: 2,
      title: 'Content Writer - Jamaican Culture',
      department: 'content',
      location: 'remote',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '$50K - $70K',
      description: 'Create engaging content that celebrates Jamaican culture, music, and community.',
      requirements: [
        'Excellent writing skills',
        'Knowledge of Jamaican culture',
        'Journalism background',
        'Social media savvy'
      ],
      benefits: [
        'Flexible schedule',
        'Creative freedom',
        'Travel opportunities',
        'Cultural immersion'
      ]
    },
    {
      id: 3,
      title: 'Marketing Manager',
      department: 'marketing',
      location: 'kingston',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '$70K - $90K',
      description: 'Lead our marketing efforts to grow YaadFeed\'s presence across the Caribbean and diaspora.',
      requirements: [
        'Digital marketing expertise',
        'Caribbean market knowledge',
        'Team leadership skills',
        'Analytics proficiency'
      ],
      benefits: [
        'Leadership opportunities',
        'Market expansion',
        'Performance bonuses',
        'Career growth'
      ]
    },
    {
      id: 4,
      title: 'Partnership Coordinator',
      department: 'sales',
      location: 'hybrid',
      type: 'Full-time',
      experience: '2-3 years',
      salary: '$45K - $60K',
      description: 'Build strategic partnerships with artists, venues, and cultural organizations.',
      requirements: [
        'Relationship building skills',
        'Event planning experience',
        'Communication excellence',
        'Cultural sensitivity'
      ],
      benefits: [
        'Networking opportunities',
        'Event access',
        'Commission structure',
        'Industry connections'
      ]
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    if (selectedDepartment !== 'all' && job.department !== selectedDepartment) return false;
    if (selectedLocation !== 'all' && job.location !== selectedLocation) return false;
    return true;
  });

  const values = [
    {
      icon: Heart,
      title: 'Passion for Culture',
      description: 'We\'re deeply committed to preserving and promoting Jamaican culture worldwide.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We embrace new technologies and creative solutions to serve our community.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We\'re building bridges between Jamaica and the world.'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Inclusive Culture',
      description: 'Diverse team where everyone\'s voice matters'
    },
    {
      icon: MapPin,
      title: 'Flexible Work',
      description: 'Remote, hybrid, and office options available'
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Respect for personal time and family commitments'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'Fair compensation with growth opportunities'
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
            Join Our <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">Team</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Help us build the digital bridge that connects Jamaica to the world. 
            Be part of something bigger than yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glamour" size="lg">
              View Open Positions
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-logo-primary">
              Learn About Culture
            </Button>
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
              The principles that guide our work and shape our culture
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

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-logo-light to-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Why Work at <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">YaadFeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in taking care of our team so they can do their best work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center soft-card p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Open <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Positions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect role that matches your skills and passion
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-logo-primary/30 focus:border-transparent shadow-soft"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-logo-primary/30 focus:border-transparent shadow-soft"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-8">
            {filteredJobs.map((job) => (
              <div key={job.id} className="soft-card p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                      <span className="bg-gradient-to-r from-logo-primary to-logo-primary/90 text-white px-3 py-1 rounded-xl text-sm font-semibold shadow-soft">
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{departments.find(d => d.value === job.department)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{locations.find(l => l.value === job.location)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{job.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-logo-primary rounded-full"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-logo-secondary rounded-full"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:flex-shrink-0">
                    <Button variant="glamour" size="lg" className="w-full lg:w-auto">
                      <Send className="w-5 h-5 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No positions found</h3>
                <p className="text-gray-600 mb-6">
                  No positions match your current filters. Try adjusting your criteria or check back later.
                </p>
                <Button 
                  variant="glamour"
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-logo-primary via-logo-secondary to-logo-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-soft">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Don't See the Right Fit?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              We're always looking for talented individuals who are passionate about Jamaican culture. 
              Send us your resume and let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white/90 backdrop-blur-lg text-logo-primary hover:bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 text-xl font-bold px-8 py-4">
                Send Resume
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

export default CareersPage;
