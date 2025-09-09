import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | YaadFeed',
  description: 'Read the YaadFeed Terms of Service, including user responsibilities, acceptable use, and legal terms.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-6 text-gray-800 leading-7">
        <p>
          Welcome to YaadFeed. By accessing or using our website, mobile site, or any related
          services (collectively, the "Services"), you agree to be bound by these Terms of Service
          ("Terms"). If you do not agree to these Terms, please discontinue use of the Services.
        </p>

        <h2 className="text-xl font-semibold">1. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Services. If you are under the age of
          majority in your jurisdiction, you may use the Services only with the involvement of a
          parent or guardian.
        </p>

        <h2 className="text-xl font-semibold">2. Use of the Services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You agree to use the Services only for lawful purposes.</li>
          <li>Do not attempt to interfere with or disrupt the operation or security of the Services.</li>
          <li>Do not scrape, harvest, or collect data from the Services except as permitted by law.</li>
          <li>Do not impersonate any person or entity or misrepresent your affiliation.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Accounts</h2>
        <p>
          If account features are provided, you are responsible for maintaining the confidentiality
          of your login credentials and for all activities under your account. Notify us immediately
          of any unauthorized use or suspected breach of security.
        </p>

        <h2 className="text-xl font-semibold">4. Content and Intellectual Property</h2>
        <p>
          The content on the Services, including text, images, graphics, logos, and audiovisual
          materials, is owned by or licensed to YaadFeed and is protected by applicable intellectual
          property laws. You may not copy, reproduce, distribute, modify, or create derivative works
          from our content without prior written permission, except as allowed by fair use or other
          applicable law.
        </p>

        <h2 className="text-xl font-semibold">5. User Submissions</h2>
        <p>
          If you submit or post content (for example, comments or messages), you grant YaadFeed a
          non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, and
          display such content in connection with operating and promoting the Services. You represent
          and warrant that you have the rights necessary to grant this license and that your content
          does not infringe the rights of others.
        </p>

        <h2 className="text-xl font-semibold">6. Third-Party Links and Services</h2>
        <p>
          The Services may contain links to third-party websites, services, or resources that are
          not owned or controlled by YaadFeed. We are not responsible for the content, policies, or
          practices of any third parties, and you access them at your own risk.
        </p>

        <h2 className="text-xl font-semibold">7. Advertising and Monetization</h2>
        <p>
          Our Services may display advertisements, sponsored content, affiliate links, or other
          monetization features. Advertisers and partners are solely responsible for their content,
          and their terms and privacy practices apply. We do not endorse, guarantee, or assume
          responsibility for third-party products or services.
        </p>

        <h2 className="text-xl font-semibold">8. Disclaimer of Warranties</h2>
        <p>
          The Services are provided on an "as is" and "as available" basis without warranties of any
          kind, whether express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement. We do not warrant
          that the Services will be uninterrupted, secure, or error-free.
        </p>

        <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, YaadFeed and its affiliates, officers, employees,
          and agents will not be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from
          your access to or use of (or inability to access or use) the Services.
        </p>

        <h2 className="text-xl font-semibold">10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless YaadFeed and its affiliates from and against any
          claims, liabilities, damages, losses, and expenses, including reasonable legal and
          accounting fees, arising out of or in any way connected with your use of the Services or
          violation of these Terms.
        </p>

        <h2 className="text-xl font-semibold">11. Changes to the Services and Terms</h2>
        <p>
          We may update, modify, or discontinue the Services at any time. We may also revise these
          Terms from time to time. The updated Terms will be effective when posted. Your continued
          use of the Services constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-xl font-semibold">12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of your local jurisdiction, without regard to its
          conflict of law principles. Any disputes arising out of or relating to these Terms or the
          Services will be resolved in the courts located in that jurisdiction, unless otherwise
          required by applicable law.
        </p>

        <h2 className="text-xl font-semibold">13. Contact Us</h2>
        <p>
          If you have questions about these Terms, please contact us at
          <span className="whitespace-pre"> </span>
          <a className="text-teal-600 underline" href="mailto:contact@yaadfeed.com">contact@yaadfeed.com</a>.
        </p>
      </section>
    </div>
  );
}


