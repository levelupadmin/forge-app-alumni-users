import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import forgeLogo from '@/assets/forge-logo.png';
import {
  ArrowUpRight,
  Plus,
} from 'lucide-react';

// "Real moments" - staggered premium row of real alumni photos.
// Swap these for real group photos: drop files in /public/images and keep/adjust the paths.
// `aspect` controls each tile's shape; `offset` staggers its vertical baseline on sm+.
const MOMENTS = [
  { src: '/images/community-photo-outdoor.webp', alt: 'Forge alumni at a retreat, group photo in front of palms', caption: 'Mumbai retreat', aspect: 'aspect-[4/3]', offset: 'sm:mt-12 lg:mt-16' },
  { src: '/images/community-photo-beach.webp',   alt: 'A beachside selfie of Forge alumni',                       caption: 'Versova meet',   aspect: 'aspect-[3/4]', offset: '' },
  { src: '/images/community-photo-stage.webp',   alt: 'Cohort group portrait on a red stage',                    caption: 'Cohort 04 wrap', aspect: 'aspect-[4/3]', offset: 'sm:mt-12 lg:mt-20' },
];

const CTA_TO = '/community-redesign/sign-in';

// Filled amber pill - primary CTA used across sections.
const CtaButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Link
    to={CTA_TO}
    className={`group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3 shadow-[0_18px_40px_-18px_hsl(41_100%_62%/0.6)] ${className}`}
  >
    Enter the Circle
    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </Link>
);

// Subtle amber text link - lighter CTA for side panels / sections next to a big CTA.
const CtaLink: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Link
    to={CTA_TO}
    className={`group inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all ${className}`}
  >
    Enter the Circle <ArrowUpRight className="h-4 w-4" />
  </Link>
);

const CommunityLanding: React.FC = () => {
  // Mobile sticky CTA - appears once the hero scrolls off, so warm alumni
  // can sign in from anywhere on the (long) page. Hidden again once the final
  // CTA enters view, so we never stack two amber buttons at the bottom.
  const [showStickyCta, setShowStickyCta] = useState(false);
  const finalCtaRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 560;
      const cta = finalCtaRef.current;
      const ctaInView = cta ? cta.getBoundingClientRect().top < window.innerHeight - 80 : false;
      setShowStickyCta(pastHero && !ctaInView);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0a08] text-[#f5efe2] font-sans antialiased [overflow-x:clip] selection:bg-primary/30">
      {/* Subtle paper-grain texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0b0a08]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link to="/community-redesign/landing" className="flex items-center">
            <img src={forgeLogo} alt="The Forge" className="h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-9 text-[11px] uppercase tracking-[0.24em] text-[#f5efe2]/55">
            <a href="#what" className="hover:text-[#f5efe2] transition-colors">What it is</a>
            <a href="#who" className="hover:text-[#f5efe2] transition-colors">Who&apos;s in</a>
            <a href="#how" className="hover:text-[#f5efe2] transition-colors">How</a>
            <a href="#not-alumni" className="hover:text-[#f5efe2] transition-colors">Not alumni? →</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/community-redesign/sign-in"
              className="inline-flex items-center gap-2 rounded-full bg-[#f5efe2] px-4 py-2 text-xs font-medium text-[#0b0a08] hover:bg-white transition-colors"
            >
              Enter the Circle
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- HERO - text left, illustration right ---------- */}
      <section className="relative">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 pt-10 sm:pt-20 lg:pt-28 pb-16 sm:pb-20">
          <div className="grid grid-cols-12 gap-y-8 gap-x-0 lg:gap-x-14 items-center">
            {/* Left - text */}
            <div className="col-span-12 lg:col-span-7">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#f5efe2]/55 max-w-md leading-[1.6]">
                The Forge Community · A private network for filmmakers, writers &amp; creators
              </div>

              <h1 className="font-bold mt-5 sm:mt-6 text-[48px] sm:text-[88px] lg:text-[112px] xl:text-[136px] leading-[0.88] tracking-[-0.04em] text-[#f5efe2]">
                <span className="block">Alumni,</span>
                <span className="block italic text-primary">only.</span>
              </h1>

              <p className="mt-6 sm:mt-8 max-w-md text-base sm:text-lg lg:text-xl leading-[1.55] text-[#f5efe2]/65">
                A closed room of Forge graduates. Find the people you spent twelve weeks with.
              </p>

              {/* Eligibility self-qualifier */}
              <p className="mt-4 inline-flex items-center gap-2 text-[13px] sm:text-sm text-primary/85">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(41_100%_62%)]" />
                Every Forge graduate. Every cohort. Every track.
              </p>

              <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/community-redesign/sign-in"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3 shadow-[0_18px_40px_-18px_hsl(41_100%_62%/0.6)]"
                >
                  Enter the Circle
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <p className="mt-5 text-[12px] sm:text-[13px] text-[#f5efe2]/60">
                Find collaborators. Hire each other. Post and apply to gigs.
              </p>
            </div>

            {/* Right - cinematographer photo */}
            <div className="col-span-12 lg:col-span-5">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black">
                <div className="aspect-square">
                  <img
                    src="/images/community-photo-hero.webp"
                    alt="A Forge alum behind the camera, lit by a red practical"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- REAL MOMENTS - alumni photos ---------- */}
      <section className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-32">
        <div className="mb-10 lg:mb-14">
          <h2 className="font-bold text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.0] tracking-[-0.02em] text-[#f5efe2] max-w-3xl">
            The fun doesn’t end
            <br />
            when <span className="italic text-primary whitespace-nowrap">The Forge</span> does.
          </h2>
        </div>

        {/* Staggered premium row - varied heights + vertical offsets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8 items-start">
          {MOMENTS.map((m) => (
            <figure key={m.src} className={`group ${m.offset}`}>
              <div className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-black ${m.aspect}`}>
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#f5efe2]/45">{m.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 lg:mt-16 flex justify-center">
          <CtaButton />
        </div>
      </section>

      {/* ---------- WHAT IT IS - Two-tab toggle (Surf / Turf style) ---------- */}
      <section id="what" className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 pt-16 lg:pt-32">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/55">What it is</div>
            <h2 className="font-bold mx-auto mt-4 max-w-3xl text-[40px] sm:text-[60px] lg:text-[80px] leading-[0.96] tracking-[-0.02em] text-[#f5efe2]">
              Two doors, <span className="italic text-primary">one room</span>.
            </h2>
          </div>

          {/* Stacked panels - Community first (illustration right), Gigs second (illustration left) */}
          <div className="mt-16 lg:mt-24 space-y-24 lg:space-y-32">
            <CommunityPanel />
            <GigsPanel />
          </div>
        </div>
      </section>

      {/* ---------- WHO IS IN ---------- */}
      <section id="who" className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-36">
        <div className="grid grid-cols-12 gap-y-10 gap-x-0 lg:gap-x-10 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/55">Who&apos;s in</div>
            <h2 className="font-bold mt-4 text-[36px] sm:text-[72px] lg:text-[96px] leading-[0.94] tracking-[-0.02em] text-[#f5efe2]">
              If you&apos;ve walked
              <br />
              <span className="italic text-primary">through this door</span>,
              <br />
              you&apos;re already in.
            </h2>
            <p className="mt-6 max-w-md text-base text-[#f5efe2]/60 leading-[1.6]">
              Anyone who has completed a Forge program: Filmmakers, Writers,
              or Creators. Every graduate, every cohort, every track, right down
              to the batch about to walk out.
            </p>
          </div>

          {/* Door illustration */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none overflow-hidden rounded-3xl border border-white/10 bg-black">
              <img
                src="/images/community-door.png"
                alt="A figure stepping through an amber doorway into a room of alumni"
                loading="lazy"
                className="block w-full"
              />
            </div>
          </div>

        </div>

        {/* Tracks - cards that stack on top of one another as you scroll */}
        <div className="mt-16 sm:mt-24">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.28em] text-primary/70">Three tracks</div>
            <h3 className="font-bold mt-3 text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.02] tracking-[-0.02em] text-[#f5efe2]">
              All of them, <span className="italic text-primary">in one place</span>.
            </h3>
          </div>

          <div className="relative mx-auto mt-10 max-w-xl">
            <StackCard i={0} img="/images/community-track-filmmakers.png" title="Filmmakers" body="Directors, DOPs, editors, sound, production design." />
            <StackCard i={1} img="/images/community-track-writers.png"    title="Writers"    body="Screenwriters, essayists, story producers, newsletter writers." />
            <StackCard i={2} img="/images/community-track-creators.png"   title="Creators"   body="YouTubers, reel-makers, podcasters, shorts editors." />
            {/* tail space so the last card can reach its sticky position */}
            <div className="h-[20vh]" aria-hidden />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <CtaButton />
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="border-t border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/55">How it works</div>
            <h2 className="font-bold mt-4 text-[34px] sm:text-[64px] lg:text-[80px] leading-[0.96] tracking-[-0.02em] text-[#f5efe2]">
              Two minutes. <span className="italic text-primary">In</span>.
            </h2>
          </div>

          {/* Steps - each paired with its staircase frame. Stacked on mobile, 3-across on desktop. */}
          <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            <Step n="01" img="/images/community-staircase-1.png" title="Sign in with your Forge number" body="Use the phone number you registered for your edition with. We’ll text you a one-time code. Every cohort, every track." />
            <Step n="02" img="/images/community-staircase-2.png" title="Set up your card" body="Photo, tagline, your craft, up to four roles. That’s the whole setup." />
            <Step n="03" img="/images/community-staircase-3.png" title="Browse · message · post" body="Find an alum. Pitch a project. Drop a gig. Everything else happens here." />
          </ol>

          <div className="mt-12 flex justify-center">
            <CtaButton />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-32 border-t border-white/[0.06]">
        <div className="grid grid-cols-12 gap-y-10 gap-x-0 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/55">Questions</div>
            <h2 className="font-bold mt-4 text-[32px] sm:text-[56px] lg:text-[72px] leading-[0.96] tracking-[-0.02em] text-[#f5efe2]">
              Probably <span className="italic text-primary">yours</span>, too.
            </h2>
            <p className="mt-5 max-w-xs text-sm text-[#f5efe2]/55 leading-[1.6]">
              The most common things alumni ask before they sign in.
              Anything else? <a className="underline underline-offset-4 hover:text-primary transition-colors text-[#f5efe2]/85" href="mailto:PLACEHOLDER@EMAIL.COM">Email the team.</a>
            </p>
            <CtaButton className="mt-8" />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <Faq />
          </div>
        </div>
      </section>

      {/* ---------- NOT ALUMNI ---------- */}
      <section id="not-alumni" className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0e0d0a] p-8 sm:p-12 lg:p-16">
          <div className="absolute -top-32 -right-20 h-[400px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="relative grid grid-cols-12 gap-y-8 gap-x-0 lg:gap-x-8 items-center">
            <div className="col-span-12 lg:col-span-8">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/55">Not alumni</div>
              <h2 className="font-bold mt-4 text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.98] tracking-[-0.02em] text-[#f5efe2]">
                The Circle is closed.
                <br />
                <span className="italic text-primary">The Forge isn&apos;t.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base text-[#f5efe2]/65 leading-[1.6]">
                Cohort 06 is currently open for applications: twelve weeks of intensive
                filmmaking, writing, or creator tracks led by working professionals.
                Graduate, and the Circle opens to you.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end">
              <a
                href="https://forgebylevelup.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-[#f5efe2] px-6 py-3 text-sm font-medium text-[#0b0a08] hover:bg-white transition-colors"
              >
                See open cohorts
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ONE WORLD - global community ---------- */}
      <section className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-16 lg:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary/70">The global circle</div>
          <h2 className="font-bold mt-4 text-[40px] sm:text-[64px] lg:text-[80px] leading-[0.96] tracking-[-0.02em] text-[#f5efe2]">
            One community, <span className="italic text-primary">one world</span>.
          </h2>
          <p className="mt-5 max-w-md mx-auto text-base text-[#f5efe2]/60 leading-[1.6]">
            Forge alumni are shooting, writing, and creating across cities and time zones. Wherever you land next, the Circle is already there.
          </p>

          <div className="mt-7 flex justify-center">
            <CtaLink />
          </div>
        </div>

        <div className="relative mt-10 lg:mt-14">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <img
            src="/images/community-globe.png"
            alt="A globe ringed by Forge alumni portraits connected by glowing amber lines"
            loading="lazy"
            className="relative mx-auto block w-full max-w-5xl"
          />
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section ref={finalCtaRef} className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-32 lg:pb-48">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0a08] px-8 py-20 sm:py-28 lg:py-32 text-center">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="relative">
            {/* Phone illustration anchor */}
            <img
              src="/images/community-phone.png"
              alt="A phone held in two hands showing a Circle profile card"
              loading="lazy"
              className="mx-auto h-48 sm:h-64 lg:h-72 w-auto"
            />

            <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-primary/80">The Forge</div>
            <h2 className="font-bold mt-5 text-[44px] sm:text-[88px] lg:text-[120px] leading-[0.92] tracking-[-0.03em] text-[#f5efe2]">
              <span className="block">The Circle</span>
              <span className="italic text-primary">is open</span><span className="text-[#f5efe2]"> to you.</span>
            </h2>
            <p className="mt-7 max-w-md mx-auto text-base lg:text-lg leading-[1.55] text-[#f5efe2]/60">
              Two minutes to set up. Forever to find work with people who get it.
            </p>
            <Link
              to="/community-redesign/sign-in"
              className="mt-10 group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-4 shadow-[0_20px_50px_-20px_hsl(41_100%_62%/0.6)]"
            >
              Enter the Circle
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Mobile sticky CTA ---------- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="border-t border-white/10 bg-[#0b0a08]/95 backdrop-blur-xl px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <Link
            to="/community-redesign/sign-in"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_-8px_30px_-12px_hsl(41_100%_62%/0.5)]"
          >
            Enter the Circle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 py-12 pb-28 md:pb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={forgeLogo} alt="The Forge" className="h-5 w-auto" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#f5efe2]/60">
              By LevelUp Learning · For Forge alumni only
            </span>
          </div>
          <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.24em] text-[#f5efe2]/60">
            <a className="hover:text-[#f5efe2] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#f5efe2] transition-colors" href="#">Conduct</a>
            <a className="hover:text-[#f5efe2] transition-colors" href="mailto:PLACEHOLDER@EMAIL.COM">Get in touch</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

// ---------- Tab panel: Community ----------
const CommunityPanel: React.FC = () => (
  <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
    <div className="col-span-12 lg:col-span-5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary/70">01</div>
      <h3 className="font-bold mt-4 text-[40px] sm:text-[52px] lg:text-[64px] leading-[0.95] tracking-[-0.02em] text-[#f5efe2]">
        Find your <span className="italic text-primary">people</span>.
      </h3>
      <p className="mt-5 max-w-md text-base text-[#f5efe2]/60 leading-[1.6]">
        Every Forge alum on one page. Search by craft, city, or cohort.
        Tap a card to see their reel, message them, or hire them for
        what you&apos;re shooting next.
      </p>
      <CtaLink className="mt-8" />
    </div>

    <div className="col-span-12 lg:col-span-7">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
        <img
          src="/images/community-directory.png"
          alt="A wall of polaroid portraits of Forge alumni"
          loading="lazy"
          className="block w-full"
        />
      </div>
    </div>
  </div>
);

// ---------- Tab panel: Gigs ----------
const GigsPanel: React.FC = () => (
  <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
    <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
        <img
          src="/images/community-handoff.png"
          alt="A hand picking a glowing gig card from a board of pinned film-job listings"
          loading="lazy"
          className="block w-full"
        />
      </div>
    </div>

    <div className="col-span-12 lg:col-span-5 order-1 lg:order-2">
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary/70">02</div>
      <h3 className="font-bold mt-4 text-[40px] sm:text-[52px] lg:text-[64px] leading-[0.95] tracking-[-0.02em] text-[#f5efe2]">
        Find your next <span className="italic text-primary">gig</span>.
      </h3>
      <p className="mt-5 max-w-md text-base text-[#f5efe2]/60 leading-[1.6]">
        Paid work, collabs, residencies, mentorships. Posted only by
        Forge alumni and LevelUp Learning. No spam. No recruiters.
        No ghosts.
      </p>
      <CtaLink className="mt-8" />
    </div>
  </div>
);

// ---------- FAQ ----------
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'I’m a Forge alum but my number doesn’t work. What do I do?',
    a: 'Send a quick note to PLACEHOLDER@EMAIL.COM with your name and the cohort you graduated from. We keep an alumni list and can add or update your number in 24 hours.',
  },
  {
    q: 'Who can see my profile?',
    a: 'Only other verified Forge alumni signed into the Circle. Profiles are never public, never indexed by search engines, and never shared outside this room.',
  },
  {
    q: 'Can I delete my profile?',
    a: 'Anytime. Profile → Settings → Delete profile removes your card and any gigs you’ve posted instantly. Messages you’ve sent are anonymised but not deleted from the recipient’s inbox.',
  },
  {
    q: 'What does LevelUp do with posted gigs?',
    a: 'LevelUp verifies every alumni-posted gig within 24 hours before it goes live.',
  },
  {
    q: 'Is there a fee?',
    a: 'No. The Circle is free for all Forge graduates, forever.',
  },
  {
    q: 'Can I bring a non-alumni collaborator?',
    a: 'Not into the Circle itself. Alumni-only is the whole point. But once you connect with another alum here, you’re free to collaborate with anyone outside the room.',
  },
];

const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {FAQS.map((item, i) => {
        const open = openIdx === i;
        return (
          <li key={i}>
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-6 lg:py-7 text-left transition-colors group"
            >
              <span className={`text-base sm:text-lg lg:text-xl leading-snug ${open ? 'text-[#f5efe2]' : 'text-[#f5efe2]/85 group-hover:text-[#f5efe2]'} transition-colors`}>
                {item.q}
              </span>
              <span
                className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                  open
                    ? 'border-primary/60 bg-primary/10 text-primary rotate-45'
                    : 'border-white/15 bg-white/[0.03] text-[#f5efe2]/70 group-hover:border-primary/40 group-hover:text-primary'
                }`}
                aria-hidden
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100 pb-6 lg:pb-8' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-xl text-sm sm:text-base text-[#f5efe2]/60 leading-[1.7]">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Step: React.FC<{ n: string; title: string; body: string; img?: string }> = ({ n, title, body, img }) => (
  <li className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0a08]">
    {img && (
      <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden border-b border-white/[0.06] bg-black">
        <img src={img} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover" />
      </div>
    )}
    <div className="p-6 lg:p-8">
      <div className="text-[40px] sm:text-[52px] tabular-nums text-primary leading-none">{n}</div>
      <div className="mt-5 text-xl sm:text-2xl text-[#f5efe2] leading-tight tracking-[-0.01em]">{title}</div>
      <p className="mt-3 text-sm text-[#f5efe2]/60 leading-[1.6]">{body}</p>
    </div>
  </li>
);

// ---------- Stacking track card (Who's in - pile up on scroll) ----------
// Each card is sticky with a slightly larger top offset than the last, so as
// you scroll they stack on top of one another, each peeking above the next.
const StackCard: React.FC<{ i: number; img: string; title: string; body: string }> = ({ i, img, title, body }) => (
  <div className="sticky pb-5 sm:pb-6" style={{ top: `${96 + i * 28}px` }}>
    <div className="grid grid-cols-12 items-center overflow-hidden rounded-3xl border border-white/12 bg-[#0e0d0a] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]">
      {/* Image - left column, full art (never cropped), scaled down so the text stays visible */}
      <div className="col-span-5 self-stretch flex items-center justify-center bg-black border-r border-white/10">
        <img src={img} alt={`${title} illustration`} loading="lazy" className="block w-full h-auto" />
      </div>
      {/* Heading + subtext - right column */}
      <div className="col-span-7 px-5 py-6 sm:px-8 sm:py-8">
        <h3 className="font-bold text-[26px] sm:text-[40px] leading-[1.02] tracking-[-0.02em] text-[#f5efe2]">
          {title}
        </h3>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#f5efe2]/70 leading-[1.55]">{body}</p>
      </div>
    </div>
  </div>
);

export default CommunityLanding;
