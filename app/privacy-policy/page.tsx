import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="container-portal pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <ShieldIcon className="size-6 shrink-0 text-primary" />
            <h1 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
              Privacy Policy
            </h1>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-on-surface-variant">
            <p>
              Your privacy is important to us. This Privacy Policy explains how JobInPark ("we," "us," or "the Platform") collects, uses, and protects your personal information.
            </p>

            <Section title="1. Information We Collect">
              <p>We may collect the following types of information:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Account Information:</strong> name, email address, and password when you register.</li>
                <li><strong>Profile Information:</strong> skills, experience, education, and other details you provide.</li>
                <li><strong>Usage Data:</strong> interactions with the Platform, job searches, and page views.</li>
                <li><strong>Device Information:</strong> browser type, IP address, and operating system.</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use your information to:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Provide, maintain, and improve the Platform.</li>
                <li>Match you with relevant job opportunities.</li>
                <li>Send notifications about job matches and platform updates.</li>
                <li>Ensure security and prevent fraudulent activity.</li>
              </ul>
            </Section>

            <Section title="3. Data Sharing">
              <p>
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Employers when you apply for a job through the Platform.</li>
                <li>Service providers who help operate the Platform (e.g., email delivery, hosting).</li>
                <li>Legal authorities if required by law or to protect our rights.</li>
              </ul>
            </Section>

            <Section title="4. Data Security">
              <p>
                We implement industry-standard security measures to protect your data, including encryption, access controls, and secure server infrastructure. However, no method of transmission over the internet is 100% secure.
              </p>
            </Section>

            <Section title="5. Your Rights">
              <p>You have the right to:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Access, update, or delete your personal data.</li>
                <li>Opt out of marketing communications at any time.</li>
                <li>Request a copy of the data we hold about you.</li>
              </ul>
            </Section>

            <Section title="6. Cookies">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
              </p>
            </Section>

            <Section title="7. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page.
              </p>
            </Section>

            <Section title="8. Contact">
              <p>
                If you have any questions or concerns about this Privacy Policy, please reach out through the Platform or contact us on LinkedIn.
              </p>
            </Section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-headline text-base font-semibold uppercase tracking-[-0.04em] text-on-background">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ShieldIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
