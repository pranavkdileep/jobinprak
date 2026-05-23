import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="container-portal pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <FileTextIcon className="size-6 shrink-0 text-primary" />
            <h1 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
              Terms of Service
            </h1>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-on-surface-variant">
            <p>
              By accessing or using JobInPark ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
            </p>

            <Section title="1. Acceptance of Terms">
              <p>
                These Terms constitute a legally binding agreement between you and JobInPark. We reserve the right to update these terms at any time; continued use constitutes acceptance of the changes.
              </p>
            </Section>

            <Section title="2. Use of Service">
              <p>
                You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Use the Platform in any way that violates applicable law or regulation.</li>
                <li>Attempt to gain unauthorized access to any part of the Platform.</li>
                <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
                <li>Upload or transmit malicious code, viruses, or harmful content.</li>
              </ul>
            </Section>

            <Section title="3. User Accounts">
              <p>
                When you create an account, you are responsible for maintaining the confidentiality of your credentials. You must notify us immediately of any unauthorized use of your account.
              </p>
            </Section>

            <Section title="4. Job Listings">
              <p>
                Job listings on the Platform are provided by third parties. We do not guarantee the accuracy, completeness, or validity of any listing. We are not responsible for any interactions between users and employers.
              </p>
            </Section>

            <Section title="5. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, JobInPark shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform.
              </p>
            </Section>

            <Section title="6. Termination">
              <p>
                We reserve the right to suspend or terminate your access to the Platform at any time, without prior notice, for any reason, including violation of these Terms.
              </p>
            </Section>

            <Section title="7. Contact">
              <p>
                If you have any questions about these Terms, please contact us through the Platform or reach out via LinkedIn.
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

function FileTextIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
