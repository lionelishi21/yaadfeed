import React from 'react';
import { Metadata } from 'next';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Edit3, Search, Users, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy | YardVybz',
  description: 'YardVybz\'s editorial standards, sourcing policy, correction policy, and commitment to accurate, independent Jamaican journalism.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-yard-dark">
      <ClientHeader />

      {/* Hero */}
      <section className="relative bg-yard-gray border-b border-[#1a1a1a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Editorial <span className="bg-gradient-to-r from-yard-gold to-yellow-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
            Our commitment to accurate, fair, and independent journalism covering Jamaica and the Jamaican diaspora
          </p>
          <p className="text-white/50 text-sm">Last reviewed: August 2026</p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          {/* Our Commitment */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-7 h-7 text-yard-gold" />
              <h2 className="text-3xl font-black text-white">Our Editorial Commitment</h2>
            </div>
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                YardVybz is an independent digital media publication dedicated to providing accurate, fair, and substantive coverage of Jamaica and the global Jamaican diaspora. Our editorial mission is to serve our readers with journalism that informs, contextualises, and reflects the diversity of Jamaican life — from politics and business to culture, music, and sport.
              </p>
              <p>
                Editorial decisions at YardVybz are made independently of our commercial operations. Advertisers, sponsors, and business partners have no influence over the content we publish, the stories we choose to cover, or the conclusions our reporters and editors reach. Revenue from advertising supports our operations; it does not purchase editorial coverage or positive treatment.
              </p>
              <p>
                We hold ourselves to high standards of accuracy, sourcing, and transparency. When we make mistakes — and all publications occasionally do — we correct them promptly and visibly. We believe our readers deserve to know when and why a piece of content has changed after publication.
              </p>
            </div>
          </div>

          {/* Accuracy & Fact-Checking */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-7 h-7 text-yard-gold" />
              <h2 className="text-3xl font-black text-white">Accuracy & Fact-Checking</h2>
            </div>
            <div className="border border-[#222] bg-[#111] p-6 space-y-4 text-gray-300">
              <p>
                Before publication, all original YardVybz reporting is checked against primary sources wherever possible. Our standards include:
              </p>
              <ul className="space-y-3">
                {[
                  'Verifying factual claims with at least one primary source (official statements, government documents, court records, direct interviews) where available',
                  'Seeking comment or a right of reply from any individual or organisation that is the subject of critical coverage',
                  'Clearly distinguishing between verified facts, expert opinion, and editorial commentary',
                  'Labelling opinion pieces, analysis, and editorials clearly and separately from news reporting',
                  'Not publishing unverified rumours or speculation as fact',
                  'Citing and linking to source material wherever legally and practically possible',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yard-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sources */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-7 h-7 text-yard-gold" />
              <h2 className="text-3xl font-black text-white">Sources & Attribution</h2>
            </div>
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                We believe in transparency about where our information comes from. All factual claims in our original reporting should be traceable to a named source, a linked document, or (where sources require confidentiality) a clearly explained justification for anonymity.
              </p>
              <p>
                When we aggregate or summarise content that originates from other publications, broadcasters, or wire services, we credit the originating outlet clearly and link to the original source. We do not reproduce third-party content in full without permission.
              </p>
              <p>
                Named sources are preferred. We grant anonymity to sources only when there is a compelling editorial reason — for example, when a source faces genuine risk of professional or personal harm — and only with senior editorial approval. Anonymous sources are used to direct our reporting, not as the sole basis for serious factual claims.
              </p>
            </div>
          </div>

          {/* Corrections */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Edit3 className="w-7 h-7 text-yard-gold" />
              <h2 className="text-3xl font-black text-white">Corrections Policy</h2>
            </div>
            <div className="border border-[#222] bg-[#111] p-6 space-y-4 text-gray-300">
              <p>
                Accuracy is fundamental to our editorial standards. When we publish factual errors, we correct them promptly. Our corrections process works as follows:
              </p>
              <ul className="space-y-3">
                {[
                  'Factual errors are corrected as quickly as possible once confirmed — typically within 24 hours of a valid report',
                  'Corrections are appended visibly at the top or bottom of the original article, not silently hidden',
                  'Significant corrections that change the substance of an article are noted prominently, including a brief description of what was incorrect and what is now accurate',
                  'Minor updates (broken links, spelling errors, formatting fixes) may be made without a formal correction note',
                  'We do not alter article content to remove or soften criticism after publication unless a factual error has been confirmed',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yard-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                To report an error, email{' '}
                <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline">info@yardvybz.news</a>{' '}
                with "Correction" in the subject line, or use the{' '}
                <Link href="/contact" className="text-yard-gold hover:underline">contact form</Link>.
                We read every correction request.
              </p>
            </div>
          </div>

          {/* Editorial Independence */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-7 h-7 text-yard-gold" />
              <h2 className="text-3xl font-black text-white">Editorial Independence</h2>
            </div>
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                YardVybz maintains strict separation between our commercial and editorial functions. The following principles govern our editorial independence:
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Advertiser independence', desc: 'Advertisers cannot request, preview, or influence editorial content. Ad placement near content does not imply editorial endorsement.' },
                  { title: 'Sponsored content', desc: 'Any content that is paid for or sponsored by an external party is clearly labelled as "Sponsored" or "Paid partnership". Sponsored content is never presented as independent editorial.' },
                  { title: 'Affiliate content', desc: 'Where articles contain affiliate links (links that generate a commission if a product is purchased), this is disclosed clearly at the top of the article.' },
                  { title: 'Political independence', desc: 'YardVybz does not accept payments from political parties or candidates and does not endorse political candidates. Our political coverage aims to be balanced and fact-based.' },
                ].map((item, i) => (
                  <div key={i} className="border border-[#222] bg-[#111] p-5">
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Standards */}
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Content Standards</h2>
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                All content published on YardVybz must comply with our content standards. We do not publish:
              </p>
              <ul className="space-y-3">
                {[
                  'Content that incites hatred, discrimination, or violence based on race, ethnicity, religion, gender, sexual orientation, or disability',
                  'Content that defames individuals without factual basis',
                  'Content that reproduces copyrighted material in full without permission',
                  'Misleading headlines that misrepresent the content of the article',
                  'Fabricated quotes attributed to real individuals',
                  'Content that violates Jamaican law or the laws of the jurisdictions in which our readers are located',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yard-gold text-lg mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Our comments section is moderated. Comments that violate these standards are removed. Repeated violators may be banned from commenting.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="border border-[#222] bg-[#111] p-8">
            <h2 className="text-2xl font-black text-white mb-4">Editorial Contact</h2>
            <p className="text-gray-400 mb-4">
              For editorial inquiries, corrections, story tips, or questions about our policies:
            </p>
            <a href="mailto:info@yardvybz.news" className="text-yard-gold hover:underline text-lg font-semibold">
              info@yardvybz.news
            </a>
            <p className="text-gray-500 text-sm mt-4">
              We aim to respond to all editorial inquiries within 48 hours on business days.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
