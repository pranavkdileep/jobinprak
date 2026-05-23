import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import SignupForm from "./signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your JobInPark account and start discovering AI-matched job opportunities with real-time notifications.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <div className="pointer-events-none fixed left-10 top-10 hidden size-2 border-l border-t border-outline md:block" />
      <div className="pointer-events-none fixed right-10 top-10 hidden size-2 border-r border-t border-outline md:block" />
      <div className="pointer-events-none fixed bottom-10 left-10 hidden size-2 border-b border-l border-outline md:block" />
      <div className="pointer-events-none fixed bottom-10 right-10 hidden size-2 border-b border-r border-outline md:block" />

      <section className="container-portal relative flex min-h-screen items-center py-24 md:py-28">
        <div className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-5 lg:flex lg:flex-col lg:gap-8">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-outline">
                System Identity Protocol // v4.0.2
              </p>
              <h1 className="mb-6 font-headline text-[clamp(3.5rem,6vw,5.3rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-background">
                Initialize Identity
              </h1>
              <p className="max-w-md text-body-lg leading-8 text-on-surface-variant">
                Begin your integration into the global talent mesh. Configure your node parameters and secure your access keys.
              </p>
            </div>

            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-outline-variant bg-black shadow-ambient transition duration-500 hover:-translate-y-1 hover:shadow-electric">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.08)_0_1px,transparent_1px_18px),radial-gradient(circle_at_35%_30%,rgba(255,255,255,.72),transparent_18%),radial-gradient(circle_at_70%_65%,rgba(30,115,255,.42),transparent_26%),linear-gradient(135deg,#0b0d10,#a8adb7_48%,#111418)] opacity-90 grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(18deg,transparent_0_18px,rgba(0,0,0,.45)_19px,transparent_20px),repeating-linear-gradient(145deg,transparent_0_28px,rgba(0,0,0,.35)_29px,transparent_30px)] mix-blend-multiply" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/35 to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-lg border border-outline/20 bg-background/90 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-on-surface shadow-ambient">
                Lat: 40.7128 N | Long: 74.0060 W
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <div className="mb-8 lg:hidden">
              <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-outline">
                System Identity Protocol // v4.0.2
              </p>
              <h1 className="mb-3 font-headline text-[clamp(2.5rem,12vw,4rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-background">
                Initialize Identity
              </h1>
              <div className="h-1 w-12 bg-primary" />
            </div>

            <SignupForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
