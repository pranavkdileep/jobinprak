import Link from "next/link";

const navItems = ["Explore", "Careers", "Jobs", "Network"];

export function SiteHeader() {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-[72rem] -translate-x-1/2 rounded-full border border-white/60 bg-white/55 px-4 py-3 shadow-ambient backdrop-blur-2xl md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-headline text-xl font-bold tracking-[-0.08em] text-on-background transition-transform duration-300 hover:scale-105 md:text-2xl"
          aria-label="Jobgrid home"
        >
          JOBGRID
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`relative text-label-md transition duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full ${
                index === 0
                  ? "text-primary after:w-full"
                  : "text-on-surface-variant after:w-0"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/login"
            className="hidden text-label-md text-on-background transition-colors duration-300 hover:text-primary md:block"
          >
            Auth
          </Link>
          <Link
            href="/signup"
            className="group rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-on-surface hover:shadow-electric md:px-6"
          >
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              Initialize Account
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
