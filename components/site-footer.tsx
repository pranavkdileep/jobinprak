import Link from "next/link";

const footerLinks: { label: string; href: string }[] = [
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export function SiteFooter() {
  return (
    <footer className="glass-panel-dark relative mt-20 overflow-hidden rounded-t-[2rem] px-5 py-14 md:px-16 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-[6rem]" />
      <div className="relative mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-8 md:flex-row">
        <div className="font-headline text-2xl font-bold tracking-[-0.08em] text-white">
          JobInPark
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45 transition duration-300 hover:text-primary-fixed-dim"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-center font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45 md:text-right">
          © 2026 JobInPark Protocol. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
