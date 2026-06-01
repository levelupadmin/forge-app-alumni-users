import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import forgeLogo from '@/assets/forge-logo.png';
import forgeIcon from '@/assets/forge-icon.png';
import {
  Search,
  MapPin,
  Sparkles,
  Bell,
  ArrowUpRight,
  Briefcase,
  MessageCircle,
  Users,
  Calendar,
  Star,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Clock,
  Plus,
  Lock,
} from 'lucide-react';

// ---------- Profile-complete gate ----------
// Read once per render; updates if localStorage changes via storage event.
const useProfileComplete = (): boolean => {
  const [complete, setComplete] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('forge.profileComplete') === 'true';
  });
  React.useEffect(() => {
    const onStorage = () => setComplete(window.localStorage.getItem('forge.profileComplete') === 'true');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return complete;
};

// ---------- Mock data ----------
type Creative = {
  id: string;
  name: string;
  tagline: string;
  city: string;
  occupations: string[];
  avatar?: string;
  available: boolean;
  works: number;
  cohort: string;
  spotlight?: boolean;
  quote?: string;
  samples?: string[];
};

const portrait = (seed: string) => `https://i.pravatar.cc/600?u=${encodeURIComponent(seed)}`;

const CREATIVES: Creative[] = [
  {
    id: '1',
    name: 'Aanya Mehra',
    tagline: 'Directing intimate documentaries about Indian craft.',
    city: 'Mumbai',
    occupations: ['Director', 'DOP'],
    available: true,
    works: 12,
    cohort: 'Cohort 04',
    spotlight: true,
    quote: 'I shoot the spaces between sentences.',
    avatar: portrait('aanya-mehra'),
    samples: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600',
    ],
  },
  { id: '2', name: 'Rohan Iyer', tagline: 'Editor / Colorist — long-form & branded.', city: 'Bengaluru', occupations: ['Editor', 'Colorist'], available: true, works: 24, cohort: 'Cohort 03', avatar: portrait('rohan-iyer') },
  { id: '3', name: 'Shruti Pillai', tagline: 'Writes screenplays you can taste.', city: 'Mumbai', occupations: ['Writer'], available: false, works: 6, cohort: 'Cohort 04', avatar: portrait('shruti-pillai') },
  { id: '4', name: 'Kabir Ahmed', tagline: 'Sound design, scoring, foley. Loves rain.', city: 'Delhi', occupations: ['Sound', 'Composer'], available: true, works: 18, cohort: 'Cohort 02', avatar: portrait('kabir-ahmed') },
  { id: '5', name: 'Maya Krishnan', tagline: 'Producer — short films, music videos, ads.', city: 'Chennai', occupations: ['Producer'], available: true, works: 31, cohort: 'Cohort 04', avatar: portrait('maya-krishnan') },
  { id: '6', name: 'Arjun Bose', tagline: 'Photographer pretending to be a cinematographer.', city: 'Kolkata', occupations: ['Photographer', 'DOP'], available: false, works: 9, cohort: 'Cohort 03', avatar: portrait('arjun-bose') },
  { id: '7', name: 'Neha Raghavan', tagline: 'Visual design + motion. Loud and tactile.', city: 'Mumbai', occupations: ['Designer', 'Motion'], available: true, works: 14, cohort: 'Cohort 04', avatar: portrait('neha-raghavan') },
  { id: '8', name: 'Ishaan Verma', tagline: 'AD and 1st AD on indie sets.', city: 'Pune', occupations: ['AD'], available: true, works: 11, cohort: 'Cohort 02', avatar: portrait('ishaan-verma') },
  { id: '9', name: 'Tara Sen', tagline: 'Production designer. Loves period sets.', city: 'Mumbai', occupations: ['Production Designer'], available: true, works: 8, cohort: 'Cohort 03', avatar: portrait('tara-sen') },
  { id: '10', name: 'Devansh Roy', tagline: 'VFX / compositor. Nuke & Fusion.', city: 'Hyderabad', occupations: ['VFX'], available: false, works: 22, cohort: 'Cohort 01', avatar: portrait('devansh-roy') },
  { id: '11', name: 'Aditi Nair', tagline: 'Casting & talent for indie features.', city: 'Mumbai', occupations: ['Casting'], available: true, works: 17, cohort: 'Cohort 04', avatar: portrait('aditi-nair') },
  { id: '12', name: 'Vikram Joshi', tagline: 'Music video director. Bold colour, bold cuts.', city: 'Delhi', occupations: ['Director'], available: true, works: 13, cohort: 'Cohort 03', avatar: portrait('vikram-joshi') },
  { id: '13', name: 'Priya Khanna', tagline: 'Travel YouTube essays · 80k subs.', city: 'Goa', occupations: ['Creator'], available: true, works: 64, cohort: 'Cohort 04', avatar: portrait('priya-khanna') },
  { id: '14', name: 'Sahil Mathur', tagline: 'Podcaster — long-form interviews with Indian artists.', city: 'Mumbai', occupations: ['Podcaster'], available: true, works: 42, cohort: 'Cohort 03', avatar: portrait('sahil-mathur') },
  { id: '15', name: 'Meera Das', tagline: 'Newsletter essayist on cinema & politics.', city: 'Bengaluru', occupations: ['Writer'], available: true, works: 28, cohort: 'Cohort 04', avatar: portrait('meera-das') },
  { id: '16', name: 'Anand Pillai', tagline: 'Shorts editor — comedy, news, hot takes.', city: 'Chennai', occupations: ['Editor','Creator'], available: false, works: 110, cohort: 'Cohort 02', avatar: portrait('anand-pillai') },
];

const OCCUPATIONS = ['All', 'Director', 'Writer', 'Editor', 'Creator', 'Podcaster', 'DOP', 'Producer', 'Sound', 'Designer', 'AD', 'Colorist', 'Motion', 'VFX', 'Casting'];

type WorkType = 'paid' | 'collab' | 'mentorship' | 'residency';
type Mode = 'remote' | 'hybrid' | 'onsite';

type Poster =
  | { kind: 'alumni'; name: string; cohort: string; avatar: string }
  | { kind: 'levelup'; name: 'LevelUp Learning' };

const alumPoster = (name: string, cohort: string): Poster => ({
  kind: 'alumni',
  name,
  cohort,
  avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
});
const levelup: Poster = { kind: 'levelup', name: 'LevelUp Learning' };

type Gig = {
  id: string;
  title: string;
  postedBy: Poster;
  budget: string;
  location: string;
  role: string;
  workType: WorkType;
  mode: Mode;
  postedAt: string;
  description: string;
  status: 'open' | 'closing' | 'closed';
};

const GIGS: Gig[] = [
  { id: 'g1', title: 'DOP for 3-day documentary shoot in Kerala', postedBy: alumPoster('Aanya Mehra', 'Cohort 04'), budget: '₹45–60k', location: 'Kerala', role: 'DOP', workType: 'paid', mode: 'onsite', postedAt: '2h', description: 'Looking for someone fluent with a Sony FX6 and naturalistic light. Tea estates, interviews, vérité b-roll.', status: 'open' },
  { id: 'g2', title: 'Editor — 90s ad cuts, fast turnaround', postedBy: alumPoster('Maya Krishnan', 'Cohort 04'), budget: '₹20k flat', location: 'Remote', role: 'Editor', workType: 'paid', mode: 'remote', postedAt: '6h', description: 'Five spots, footage clean, brief is tight. Premiere or Resolve.', status: 'open' },
  { id: 'gL1', title: 'Editor for the Cohort 05 graduation reel', postedBy: levelup, budget: '₹50k flat', location: 'Mumbai / Remote', role: 'Editor', workType: 'paid', mode: 'hybrid', postedAt: '12h', description: '3-min hype reel pulling from 22 short films. Direct brief from Forge faculty. Two-week delivery.', status: 'open' },
  { id: 'g3', title: 'Sound designer for short film (post)', postedBy: alumPoster('Rohan Iyer', 'Cohort 03'), budget: '₹35k', location: 'Mumbai / Remote', role: 'Sound', workType: 'paid', mode: 'hybrid', postedAt: '1d', description: 'Atmospheric drama, 18 min. Foley + design + mix. Festival cut due in 3 weeks.', status: 'closing' },
  { id: 'g4', title: 'Writer wanted — 4 episode web series', postedBy: alumPoster('Vikram Joshi', 'Cohort 03'), budget: '₹1.2L total', location: 'Mumbai', role: 'Writer', workType: 'paid', mode: 'onsite', postedAt: '2d', description: 'Crime-drama set in coastal Karnataka. Want a writer who has lived in or written about that landscape.', status: 'open' },
  { id: 'gL2', title: 'Mentor-in-residence — Cohort 06 directing track', postedBy: levelup, budget: '₹2L stipend', location: 'Bengaluru', role: 'Director', workType: 'residency', mode: 'onsite', postedAt: '3d', description: '8-week residency mentoring 12 first-time directors. For alumni 3+ years out, with at least one festival-track film.', status: 'open' },
  { id: 'g5', title: 'Co-director on a no-budget short', postedBy: alumPoster('Shruti Pillai', 'Cohort 04'), budget: 'Credit + meals', location: 'Bengaluru', role: 'Director', workType: 'collab', mode: 'onsite', postedAt: '3d', description: 'Two-hander, single location. Looking for someone to share direction credit and crew it together.', status: 'open' },
  { id: 'g6', title: 'Junior editor — shadow for a month', postedBy: alumPoster('Anand Pillai', 'Cohort 02'), budget: 'Mentorship', location: 'Remote', role: 'Editor', workType: 'mentorship', mode: 'remote', postedAt: '4d', description: 'Daily-cut workflow on a YouTube channel. You learn, you cut a few episodes, no money but a real credit.', status: 'open' },
  { id: 'g7', title: 'Production designer — period drama', postedBy: alumPoster('Maya Krishnan', 'Cohort 04'), budget: '₹80k', location: 'Bengaluru', role: 'Production Designer', workType: 'paid', mode: 'onsite', postedAt: '5d', description: '1970s Bombay flat. Sourcing-heavy. Two-week build.', status: 'open' },
  { id: 'g8', title: 'Designer for podcast brand identity', postedBy: alumPoster('Sahil Mathur', 'Cohort 03'), budget: '₹25k', location: 'Remote', role: 'Designer', workType: 'paid', mode: 'remote', postedAt: '6d', description: 'Long-form interview podcast. Need a wordmark, episode templates, social toolkit.', status: 'open' },
  { id: 'g9', title: 'Composer-in-residence — debut feature', postedBy: alumPoster('Aanya Mehra', 'Cohort 04'), budget: 'Profit share', location: 'Mumbai / Remote', role: 'Composer', workType: 'residency', mode: 'hybrid', postedAt: '1w', description: 'Score a debut feature over 8 weeks. Festival-track, profit share + ALL rights credit.', status: 'open' },
];

const RECENT_JOINERS = [
  { name: 'Tara Sen', role: 'Production Designer', city: 'Mumbai' },
  { name: 'Vikram Joshi', role: 'Director', city: 'Delhi' },
  { name: 'Aditi Nair', role: 'Casting', city: 'Mumbai' },
];

const TRENDING_ROLES: Array<{ role: string; count: number; delta: string }> = [
  { role: 'DOP', count: 34, delta: '+8' },
  { role: 'Editor', count: 41, delta: '+5' },
  { role: 'Writer', count: 28, delta: '+3' },
  { role: 'Sound', count: 19, delta: '+2' },
];

// ---------- Helpers ----------
const initialsOf = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// ---------- Page ----------
const CommunityRedesign: React.FC = () => {
  const [tab, setTab] = useState<'creatives' | 'gigs' | 'chat'>('creatives');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1300px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(41_100%_62%/0.18),transparent_70%)] blur-3xl" />
        <div className="absolute top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,hsl(27_85%_48%/0.10),transparent_70%)] blur-3xl" />
        <div className="absolute top-[40vh] -right-40 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,hsl(39_90%_44%/0.08),transparent_70%)] blur-3xl" />
      </div>

      <TopBar tab={tab} setTab={setTab} />

      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12 pb-32 md:pb-32">
        {tab === 'creatives' && <CreativesView />}
        {tab === 'gigs' && <GigsView />}
        {tab === 'chat' && <ChatView />}
      </main>
    </div>
  );
};

// ---------- Top bar (sticky, full-width) ----------
const TopBar: React.FC<{ tab: 'creatives' | 'gigs' | 'chat'; setTab: (t: 'creatives' | 'gigs' | 'chat') => void }> = ({ tab, setTab }) => {
  const items: Array<{ key: 'creatives' | 'gigs' | 'chat'; label: string; icon: React.ReactNode }> = [
    { key: 'creatives', label: 'Creatives', icon: <Users className="h-4 w-4" /> },
    { key: 'gigs', label: 'Gigs', icon: <Briefcase className="h-4 w-4" /> },
    { key: 'chat', label: 'Chat', icon: <MessageCircle className="h-4 w-4" /> },
  ];
  return (
    <>
    {/* Desktop / tablet top bar */}
    <header className="sticky top-0 z-30 hidden border-b border-border/40 bg-background/80 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-8 px-8 lg:px-12">
        <Link to="/community-redesign" className="flex items-center">
          <img src={forgeLogo} alt="The Forge" className="h-8 w-auto" />
        </Link>
        <nav>
          <ul className="flex gap-1">
            {items.map(it => {
              const active = tab === it.key;
              return (
                <li key={it.key}>
                  <button
                    onClick={() => setTab(it.key)}
                    className={cn(
                      'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className={cn(active ? 'text-primary' : 'text-muted-foreground/70')}>{it.icon}</span>
                    <span className="text-lg tracking-tight">{it.label}</span>
                    <span
                      className={cn(
                        'absolute -bottom-[17px] left-0 right-0 h-[2px] origin-center transition-transform duration-300',
                        active ? 'scale-x-100 bg-primary shadow-[0_0_10px_hsl(41_100%_62%/0.7)]' : 'scale-x-0 bg-primary/40 group-hover:scale-x-50'
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/community-redesign/onboarding"
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Set up profile
          </Link>
          <Link
            to="/community-redesign/inbox"
            aria-label="Inbox"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-card/60 text-foreground backdrop-blur transition-all hover:border-primary/40 hover:text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(41_100%_62%)]" />
          </Link>
        </div>
      </div>
    </header>

    {/* Mobile top bar — logo + bell only */}
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl md:hidden">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <Link to="/community-redesign" className="flex items-center">
          <img src={forgeLogo} alt="The Forge" className="h-7 w-auto" />
        </Link>
        <Link
          to="/community-redesign/inbox"
          aria-label="Inbox"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-card/60 text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(41_100%_62%)]" />
        </Link>
      </div>
    </header>

    {/* Mobile bottom tab nav */}
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
      <ul className="flex">
        {items.map(it => {
          const active = tab === it.key;
          return (
            <li key={it.key} className="flex-1">
              <button
                onClick={() => setTab(it.key)}
                className={cn(
                  'relative flex w-full flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {it.icon}
                {it.label}
                {active && (
                  <span className="absolute top-0 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-primary shadow-[0_0_8px_hsl(41_100%_62%/0.7)]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
    </>
  );
};

// ---------- Creatives ----------
const CreativesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [scope, setScope] = useState<'all' | 'cohort'>('all');
  const [selected, setSelected] = useState<Creative | null>(null);
  const profileComplete = useProfileComplete();

  const spotlight = CREATIVES.find(c => c.spotlight)!;
  const rest = CREATIVES.filter(c => !c.spotlight);

  const filtered = useMemo(() => {
    let r = rest;
    if (role !== 'All') r = r.filter(c => c.occupations.includes(role));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    }
    if (scope === 'cohort') r = r.filter(c => c.cohort === 'Cohort 04');
    return r;
  }, [rest, role, search, scope]);

  return (
    <div>
      {/* Hero band: editorial title + spotlight side by side */}
      <section className="grid grid-cols-12 gap-8 pt-12 pb-14">
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-primary/80">
              <span className="h-px w-8 bg-primary/40" /> The Forge
            </div>
            <h1 className="font-bold mt-3 text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[80px] leading-[0.92] tracking-tight text-foreground">
              <span className="block">The</span>
              <span className="mt-1 flex items-center gap-2 sm:gap-3">
                <img src={forgeIcon} alt="" className="inline-block h-[0.7em] w-auto" aria-hidden />
                <span className="italic text-primary">Community</span>
                <span>.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
              Forge alumni meet here. Hire each other, post gigs, swap drafts, ship work that wouldn&apos;t exist otherwise.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7" />
      </section>

      {/* Profile-gate banner — only when the current user hasn't set up their own card yet */}
      {!profileComplete && (
        <section className="mt-2 mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/90">Required</div>
                  <p className="mt-1 text-base sm:text-lg leading-snug text-foreground">
                    <span className="font-bold">Set up your card first.</span>{' '}
                    <span className="text-muted-foreground">You can browse names, but profile pages stay locked until your own is up. Two-way street.</span>
                  </p>
                </div>
              </div>
              <Link
                to="/community-redesign/onboarding?required=true"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Set up profile <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main directory — full width, filters inline */}
      <section className="mt-4">
        {/* Header row: title left · search + scope + sort right */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-bold text-3xl text-foreground">
              {scope === 'cohort' ? 'Your cohort' : 'All creatives'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === 'All' ? 'Every craft.' : `Showing ${role}s.`} {search && <>Matching “{search}”.</>}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Name, craft, city…"
                className="w-full rounded-full border border-border/40 bg-card/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Scope segmented */}
            <div className="inline-flex rounded-full border border-border/40 bg-card/40 p-1">
              <button
                onClick={() => setScope('all')}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors',
                  scope === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                All
              </button>
              <button
                onClick={() => setScope('cohort')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors',
                  scope === 'cohort' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Star className="h-3 w-3" /> Your cohort
              </button>
            </div>

          </div>
        </div>

        {/* Responsive grid: 2-col on phone → 4-col on xl */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
          {filtered.map((c, idx) => (
            <CreativeTile key={c.id} c={c} large={false} accentIndex={idx} onOpen={setSelected} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/60 pb-1">
            Show more creatives
          </button>
        </div>
      </section>

      <CreativeSheet c={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

// ---------- Bottom sheet ----------
const CreativeSheet: React.FC<{ c: Creative | null; onClose: () => void }> = ({ c, onClose }) => {
  const profileComplete = useProfileComplete();
  if (!c) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-3xl border-t border-border/40 bg-card shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.5)]">
        {/* Grab handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-card/95 backdrop-blur pt-3 pb-2">
          <span className="h-1 w-12 rounded-full bg-border" />
        </div>

        {/* Header with portrait */}
        <div className="relative h-44 overflow-hidden">
          <img src={c.avatar} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {c.available && (
            <span className="absolute left-5 top-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_hsl(41_100%_62%)]" />
              For hire
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-2 -mt-12 relative">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{c.cohort}</div>
          <h3 className="mt-1 text-3xl font-bold leading-tight text-foreground">{c.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {c.city}
          </div>

          <p className="mt-5 text-base leading-relaxed text-foreground/90 border-l-2 border-primary/70 pl-3 italic">
            {c.tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {c.occupations.map(o => (
              <span key={o} className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {o}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-border/40 bg-background/40 p-4">
            <div>
              <div className="text-2xl text-foreground tabular-nums leading-none">{c.works}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Works</div>
            </div>
            <div>
              <div className={cn('text-2xl leading-none', c.available ? 'text-primary' : 'text-muted-foreground')}>
                {c.available ? 'Open' : 'Busy'}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to={profileComplete ? `/community-redesign/creative/${c.id}` : '/community-redesign/onboarding?required=true'}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={onClose}
            >
              {profileComplete ? <>View profile <ArrowUpRight className="h-4 w-4" /></> : <><Lock className="h-4 w-4" /> Set up your card first</>}
            </Link>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/40 px-5 py-3 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BigStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div>
    <div className="text-4xl xl:text-5xl leading-none text-foreground">{value}</div>
    <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
  </div>
);

const AdBanner: React.FC = () => (
  <article className="relative h-full min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-3xl border border-border/40 bg-black">
    {/* Illustration centered, full-bleed but not cropped */}
    <img
      src="/images/community-hero.png"
      alt="Forge alumni helping each other climb"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />

    {/* Eyebrow chip — top-left */}
    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(41_100%_62%)]" />
      The Forge · Community
    </span>
  </article>
);

const SpotlightCard: React.FC<{ creative: Creative }> = ({ creative }) => (
  <article className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/70 backdrop-blur min-h-[460px]">
    <div className="absolute inset-0 bg-[radial-gradient(at_top_right,hsl(41_100%_62%/0.18),transparent_55%)]" />
    <div className="relative grid h-full grid-cols-5">
      {/* Left: visual area with avatar + work strip */}
      <div className="col-span-2 relative flex flex-col justify-between bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/50 bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(41_100%_62%)] animate-pulse" />
          Spotlight
        </div>
        <div className="flex items-center justify-center flex-1 my-4">
          <Avatar className="h-40 w-40 ring-4 ring-background/60 shadow-2xl">
            <AvatarImage src={creative.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-5xl">{initialsOf(creative.name)}</AvatarFallback>
          </Avatar>
        </div>
        {creative.samples && (
          <div className="grid grid-cols-3 gap-1.5">
            {creative.samples.slice(0, 3).map((s, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-md border border-border/40">
                <img src={s} alt="" className="h-full w-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Right: text + meta */}
      <div className="col-span-3 p-8 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{creative.cohort} · {creative.city}</div>
          {creative.available && (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(41_100%_62%)]" /> Available
            </span>
          )}
        </div>
        <h3 className="font-bold mt-3 text-5xl leading-tight text-foreground">{creative.name}</h3>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">{creative.tagline}</p>
        {creative.quote && (
          <p className="mt-6 italic text-xl text-foreground/90 border-l-2 border-primary/70 pl-4 leading-snug">
            “{creative.quote}”
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {creative.occupations.map(o => (
            <span key={o} className="px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border border-border/50 text-muted-foreground">
              {o}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-8 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="text-2xl text-foreground tabular-nums">{creative.works}</span>
            <span className="ml-1.5">works shipped</span>
          </div>
          <button className="group inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
            View profile
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  </article>
);

const FeaturedStrip: React.FC = () => {
  const featured = CREATIVES.slice(1, 5);
  return (
    <section className="border-y border-border/40 -mx-8 lg:-mx-12 px-8 lg:px-12 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary/80">★ Featured this week</div>
          <h2 className="font-bold mt-1 text-2xl text-foreground">Picked by the editors</h2>
        </div>
        <button className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
          See all featured →
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map(c => (
          <FeaturedCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
};

const FeaturedCard: React.FC<{ c: Creative }> = ({ c }) => (
  <article className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-card hover:-translate-y-0.5">
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 ring-2 ring-border/50 transition-all group-hover:ring-primary/40">
        <AvatarImage src={c.avatar} />
        <AvatarFallback className="bg-primary/15 text-primary">{initialsOf(c.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-lg leading-tight text-foreground truncate">{c.name}</h3>
        <div className="text-[11px] text-muted-foreground">{c.occupations[0]} · {c.city}</div>
      </div>
      {c.available && <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(41_100%_62%)] animate-pulse" />}
    </div>
    <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.tagline}</p>
  </article>
);

const FilterPanel: React.FC<{
  scope: 'all' | 'cohort';
  setScope: (s: 'all' | 'cohort') => void;
  role: string;
  setRole: (r: string) => void;
  search: string;
  setSearch: (s: string) => void;
}> = ({ scope, setScope, role, setRole, search, setSearch }) => (
  <div className="space-y-5">
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Search</div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Name, craft, city…"
          className="w-full border-b border-border/40 bg-transparent pb-2 pl-6 pr-2 pt-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
        />
      </div>
    </div>

    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Scope</div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setScope('all')}
          className={cn(
            'flex items-center py-1.5 text-sm transition-colors',
            scope === 'all' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className={cn('h-1.5 w-1.5 rounded-full', scope === 'all' ? 'bg-primary' : 'bg-border')} />
            All creatives
          </span>
        </button>
        <button
          onClick={() => setScope('cohort')}
          className={cn(
            'flex items-center py-1.5 text-sm transition-colors',
            scope === 'cohort' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className={cn('h-1.5 w-1.5 rounded-full', scope === 'cohort' ? 'bg-primary' : 'bg-border')} />
            <Star className="h-3 w-3 text-primary" /> Your cohort
          </span>
        </button>
      </div>
    </div>

    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Craft</div>
      <div className="flex flex-wrap gap-1.5">
        {OCCUPATIONS.map(o => {
          const active = role === o;
          return (
            <button
              key={o}
              onClick={() => setRole(o)}
              className={cn(
                'px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] transition-all border',
                active
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const TrendingPanel: React.FC = () => (
  <div className="border-t border-border/40 pt-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
      <TrendingUp className="h-3 w-3 text-primary" /> Trending crafts
    </div>
    <ul className="space-y-2.5">
      {TRENDING_ROLES.map(r => (
        <li key={r.role} className="flex items-center justify-between text-sm">
          <span className="text-foreground">{r.role}</span>
          <span className="text-xs text-primary">↑ trending</span>
        </li>
      ))}
    </ul>
  </div>
);

const RecentJoinersPanel: React.FC = () => (
  <div className="border-t border-border/40 pt-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
      <Clock className="h-3 w-3 text-primary" /> Just joined
    </div>
    <ul className="space-y-3">
      {RECENT_JOINERS.map(j => (
        <li key={j.name} className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-1 ring-border/50">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{initialsOf(j.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-foreground truncate">{j.name}</div>
            <div className="text-[11px] text-muted-foreground">{j.role} · {j.city}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const CreativeTile: React.FC<{ c: Creative; large?: boolean; accentIndex?: number; onOpen?: (c: Creative) => void }> = ({ c, onOpen }) => {
  const navigate = useNavigate();
  const profileComplete = useProfileComplete();
  const handleClick = () => {
    // Gate: if the current user hasn't set up their own profile, no other
    // profile pages are reachable — send them straight to onboarding.
    if (!profileComplete) {
      navigate('/community-redesign/onboarding?required=true');
      return;
    }
    // Desktop (hover-capable pointer) → go straight to profile.
    // Mobile (no hover) → open the bottom sheet preview.
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
    if (isDesktop) {
      navigate(`/community-redesign/creative/${c.id}`);
    } else {
      onOpen?.(c);
    }
  };
  return (
  <button type="button" onClick={handleClick} className="block w-full text-left">
  <article className="group relative aspect-[4/5] [perspective:1200px]">
    <div className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] md:group-hover:[transform:rotateX(180deg)]">
      {/* FRONT — full-bleed portrait */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border/40 bg-card [backface-visibility:hidden]">
        {c.avatar ? (
          <img
            src={c.avatar}
            alt={c.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-card text-6xl text-primary">
            {initialsOf(c.name)}
          </div>
        )}

        {/* Bottom gradient for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Available badge */}
        {c.available && (
          <span className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4 inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-primary/40 bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-primary backdrop-blur">
            <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_hsl(41_100%_62%)]" />
            For hire
          </span>
        )}

        {/* Subtle flip hint */}
        <span className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur transition-opacity md:group-hover:opacity-0">
          <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </span>

        {/* Bottom-left meta */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
          <div className="text-[10px] sm:text-[10px] uppercase tracking-[0.16em] text-primary/90 truncate font-medium">
            {c.occupations.join(' · ')}
          </div>
          <h3 className="mt-1 text-[19px] sm:text-2xl xl:text-3xl leading-[1.05] text-white truncate font-bold">{c.name}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-white/70">
            <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{c.city}</span>
            <span className="h-1 w-1 rounded-full bg-white/30 shrink-0" />
            <span className="truncate">{c.cohort}</span>
          </div>
        </div>
      </div>

      {/* BACK — info + CTA */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-primary/40 bg-card [backface-visibility:hidden] [transform:rotateX(180deg)]">
        {/* Ambient amber wash */}
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,hsl(41_100%_62%/0.18),transparent_60%)]" />
        {/* Faint portrait echo */}
        {c.avatar && (
          <img
            src={c.avatar}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-[0.08] mix-blend-luminosity"
          />
        )}

        <div className="relative flex h-full flex-col p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{c.cohort}</div>
          <h3 className="font-bold mt-1 text-2xl leading-tight text-foreground">{c.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {c.city}
          </div>

          <p className="mt-5 italic text-lg leading-snug text-foreground/90 border-l-2 border-primary/70 pl-3">
            {c.tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {c.occupations.map(o => (
              <span key={o} className="px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] border border-border/60 text-muted-foreground">
                {o}
              </span>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border/40 pt-5">
            <div>
              <div className="text-2xl text-foreground tabular-nums leading-none">{c.works}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Works</div>
            </div>
            <div>
              <div className={cn('text-2xl leading-none', c.available ? 'text-primary' : 'text-muted-foreground')}>
                {c.available ? 'Open' : 'Busy'}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</div>
            </div>
          </div>

          <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
            View profile
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  </article>
  </button>
  );
};

// ---------- Gigs ----------
const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'any', label: 'open to anything' },
  { value: 'Director', label: 'a Director' },
  { value: 'DOP', label: 'a DOP' },
  { value: 'Editor', label: 'an Editor' },
  { value: 'Writer', label: 'a Writer' },
  { value: 'Producer', label: 'a Producer' },
  { value: 'Sound', label: 'a Sound designer' },
  { value: 'Composer', label: 'a Composer' },
  { value: 'Designer', label: 'a Designer' },
  { value: 'Production Designer', label: 'a Production designer' },
  { value: 'Creator', label: 'a Creator' },
  { value: 'Podcaster', label: 'a Podcaster' },
];

const WORK_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'any', label: 'any work' },
  { value: 'paid', label: 'paid work' },
  { value: 'collab', label: 'a collaboration' },
  { value: 'mentorship', label: 'mentorship' },
  { value: 'residency', label: 'a residency' },
];

const LOC_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'anywhere', label: 'anywhere' },
  { value: 'remote', label: 'remote only' },
  { value: 'hybrid', label: 'hybrid' },
  { value: 'Mumbai', label: 'in Mumbai' },
  { value: 'Bengaluru', label: 'in Bengaluru' },
  { value: 'Delhi', label: 'in Delhi' },
  { value: 'Chennai', label: 'in Chennai' },
  { value: 'Kerala', label: 'in Kerala' },
];

const GigsView: React.FC = () => {
  const [role, setRole] = useState('any');
  const [work, setWork] = useState('any');
  const [loc, setLoc] = useState('anywhere');
  const [selected, setSelected] = useState<Gig | null>(null);

  const filtered = useMemo(() => {
    return GIGS.filter(g => {
      if (role !== 'any' && g.role !== role) return false;
      if (work !== 'any' && g.workType !== work) return false;
      if (loc === 'remote' && g.mode !== 'remote') return false;
      if (loc === 'hybrid' && g.mode !== 'hybrid') return false;
      if (!['anywhere', 'remote', 'hybrid'].includes(loc)) {
        if (!g.location.toLowerCase().includes(loc.toLowerCase())) return false;
      }
      return true;
    });
  }, [role, work, loc]);

  const reset = () => { setRole('any'); setWork('any'); setLoc('anywhere'); };
  const isDefault = role === 'any' && work === 'any' && loc === 'anywhere';

  return (
    <div>
      {/* Hero band */}
      <section className="grid grid-cols-12 gap-8 pt-12 pb-10">
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-[0.24em] text-primary/80">— Open positions</div>
          <h1 className="font-bold mt-3 text-[56px] xl:text-[80px] leading-[0.95] tracking-tight text-foreground">
            Open <span className="italic text-primary">gigs</span>.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Paid work, collaborations, and residencies — alumni to alumni. Forge keeps the matching, not the fees.
          </p>
        </div>

        {/* Rotating card stack on right */}
        <div className="col-span-12 lg:col-span-5">
          <GigStack />
        </div>
      </section>

      {/* Mad-Libs filter sentence */}
      <section className="rounded-3xl border border-border/40 bg-card/40 p-7 sm:p-10 lg:p-12 my-6">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">— Find your gig</div>
          {!isDefault && (
            <button onClick={reset} className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors">
              Reset
            </button>
          )}
        </div>

        <p className="mt-5 text-[28px] sm:text-[36px] xl:text-[44px] leading-[1.25] tracking-tight text-muted-foreground">
          I am <InlineSelect value={role} options={ROLE_OPTIONS} onChange={setRole} />{' '}
          looking for <InlineSelect value={work} options={WORK_OPTIONS} onChange={setWork} />,{' '}
          <InlineSelect value={loc} options={LOC_OPTIONS} onChange={setLoc} />.
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-5">
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground tabular-nums text-base">{filtered.length}</span>
            {' '}gig{filtered.length === 1 ? '' : 's'} match your search
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Tap any underlined word to change
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          Only Forge alumni and LevelUp Learning can post here — every gig is verified before it goes live.
        </p>
      </section>

      {/* Filtered list */}
      <section className="border-y border-border/40">
        <div className="grid grid-cols-12 gap-4 py-4 border-b border-border/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="col-span-7">Role</div>
          <div className="col-span-2 text-right">Budget</div>
          <div className="col-span-2 text-right">Location</div>
          <div className="col-span-1 text-right">·</div>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-foreground">No gigs match this search yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Try loosening one of the filters above — or {' '}
              <button onClick={reset} className="underline underline-offset-2 text-primary">reset</button>.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map(g => <GigRow key={g.id} g={g} onOpen={() => setSelected(g)} />)}
          </ul>
        )}
      </section>

      <GigDetailModal gig={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

// Rotating card stack — cycles through sponsored gigs + alumni post-a-gig CTAs
type StackCard =
  | { kind: 'sponsored'; sponsor: string; title: string; meta: string; cta: string; href: string }
  | { kind: 'featured';  badge: string; title: string; meta: string; cta: string; href: string }
  | { kind: 'cta'; emoji: string; title: string; subtitle: string; cta: string; href: string };

const STACK_CARDS: StackCard[] = [
  {
    kind: 'sponsored',
    sponsor: 'Sony India',
    title: 'DOPs wanted — FX6 documentary series',
    meta: '₹65k / day · Onsite · Mumbai',
    cta: 'View role',
    href: '#',
  },
  {
    kind: 'cta',
    emoji: '✍️',
    title: 'Got work to share?',
    subtitle: 'Forge alumni post in 60 seconds. Every gig is verified.',
    cta: 'Post a gig',
    href: '/community-redesign/post-gig',
  },
  {
    kind: 'featured',
    badge: 'Featured · Fellowship',
    title: 'Film Bazaar Co-Production Market 2026',
    meta: 'Closes Aug 31 · ₹2L stipend',
    cta: 'Apply',
    href: '#',
  },
  {
    kind: 'sponsored',
    sponsor: 'BookMyShow Studios',
    title: 'Editors for a 4-ep web series',
    meta: '₹1.5L per ep · Hybrid · Bengaluru',
    cta: 'View role',
    href: '#',
  },
  {
    kind: 'cta',
    emoji: '🤝',
    title: 'Know someone who fits?',
    subtitle: 'Refer an alum to a gig — we send you a ₹500 voucher.',
    cta: 'Refer & earn',
    href: '#',
  },
  {
    kind: 'featured',
    badge: 'Featured · Residency',
    title: 'MIFF documentary lab — Mumbai',
    meta: '6 weeks · ₹50k + housing',
    cta: 'Apply',
    href: '#',
  },
];

const GigStack: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  React.useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIdx(i => (i + 1) % STACK_CARDS.length);
    }, 4200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative h-[300px] sm:h-[340px] w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {STACK_CARDS.map((card, i) => {
        // Offset from current (positive when ahead in cycle)
        let offset = (i - idx + STACK_CARDS.length) % STACK_CARDS.length;
        // Cap at 3 visible (front + two behind)
        const isVisible = offset <= 2;
        const z = STACK_CARDS.length - offset;
        const styles: React.CSSProperties = {
          zIndex: z,
          transform:
            offset === 0
              ? 'translateY(0) scale(1)'
              : offset === 1
                ? 'translateY(14px) scale(0.96)'
                : 'translateY(28px) scale(0.92)',
          opacity: offset === 0 ? 1 : offset === 1 ? 0.55 : 0.25,
          pointerEvents: offset === 0 ? 'auto' : 'none',
          filter: offset === 0 ? 'blur(0px)' : `blur(${offset * 0.8}px)`,
        };
        return (
          <article
            key={i}
            style={styles}
            aria-hidden={offset !== 0}
            className={cn(
              'absolute inset-x-0 top-0 h-full overflow-hidden rounded-3xl border border-border/40 p-6 transition-all duration-700 ease-out',
              isVisible ? '' : 'hidden',
              card.kind === 'sponsored' && 'bg-[radial-gradient(at_top_right,hsl(41_100%_62%/0.12),transparent_60%),linear-gradient(to_bottom_right,hsl(0_0%_8%),hsl(0_0%_4%))]',
              card.kind === 'featured' && 'bg-[radial-gradient(at_bottom_left,hsl(27_85%_48%/0.18),transparent_55%),linear-gradient(to_bottom_right,hsl(0_0%_8%),hsl(0_0%_4%))]',
              card.kind === 'cta' && 'bg-gradient-to-br from-primary/15 via-card to-card border-primary/30'
            )}
          >
            <StackCardContent card={card} />
          </article>
        );
      })}

      {/* Indicator dots */}
      <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-1.5">
        {STACK_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show card ${i + 1}`}
            className={cn(
              'h-1 rounded-full transition-all',
              i === idx ? 'w-6 bg-primary shadow-[0_0_6px_hsl(41_100%_62%/0.6)]' : 'w-2 bg-border hover:bg-muted-foreground/60'
            )}
          />
        ))}
      </div>
    </div>
  );
};

const StackCardContent: React.FC<{ card: StackCard }> = ({ card }) => {
  if (card.kind === 'cta') {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-3xl">{card.emoji}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            For alumni
          </span>
        </div>
        <div>
          <h3 className="font-bold text-2xl sm:text-[28px] leading-tight tracking-tight text-foreground">{card.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.subtitle}</p>
        </div>
        <Link to={card.href} className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]">
          {card.cta} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (card.kind === 'sponsored') {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-primary backdrop-blur">
            <Sparkles className="h-3 w-3" /> Sponsored
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground truncate">{card.sponsor}</span>
        </div>
        <div>
          <h3 className="font-bold text-2xl sm:text-[26px] leading-tight tracking-tight text-foreground">{card.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{card.meta}</p>
        </div>
        <Link to={card.href} className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary transition-colors">
          {card.cta} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // featured
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-primary backdrop-blur">
          <Star className="h-3 w-3" /> {card.badge}
        </span>
        <Briefcase className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <div>
        <h3 className="font-bold text-2xl sm:text-[26px] leading-tight tracking-tight text-foreground">{card.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{card.meta}</p>
      </div>
      <Link to={card.href} className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        {card.cta} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

// Inline pill-style select with a custom dark-themed popover
const InlineSelect: React.FC<{
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);
  const current = options.find(o => o.value === value) ?? options[0];
  const isDefault = value === options[0]?.value;

  // Close on click outside / escape
  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex items-center align-baseline">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-4 py-0.5 sm:py-1 transition-all text-[0.7em] leading-none',
          isDefault
            ? 'border-border/60 bg-card text-foreground hover:border-primary/40'
            : 'border-primary/60 bg-primary/10 text-primary',
          open && 'ring-2 ring-primary/30'
        )}
      >
        {current.label}
        <ChevronDown className={cn('h-[0.5em] w-[0.5em] opacity-70 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-40 w-max min-w-[200px] max-w-[280px] overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur"
          style={{ fontSize: '14px' }}
        >
          <ul className="max-h-[280px] overflow-y-auto py-1">
            {options.map(o => {
              const selected = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={cn(
                      'group flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left transition-colors',
                      selected
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-card hover:text-primary'
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {selected ? (
                      <CheckIcon />
                    ) : (
                      <span className="h-3 w-3" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </span>
  );
};

const GigRow: React.FC<{ g: Gig; onOpen: () => void }> = ({ g, onOpen }) => {
  const statusStyles =
    g.status === 'open' ? 'text-primary border-primary/40' :
    g.status === 'closing' ? 'text-orange-400 border-orange-500/40' :
    'text-muted-foreground border-border/40';

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group grid w-full grid-cols-12 gap-4 py-7 transition-colors hover:bg-card/30 -mx-2 px-2 text-left cursor-pointer"
      >
        <div className="col-span-12 sm:col-span-7">
          <div className="flex items-center gap-3">
            <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]', statusStyles)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> {g.status}
            </span>
            <span className="text-[11px] text-muted-foreground">{g.postedAt} ago</span>
            {g.mode === 'remote' && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">· Remote</span>}
            {g.mode === 'hybrid' && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">· Hybrid</span>}
          </div>
          <h3 className="font-bold mt-2 text-2xl leading-tight text-foreground group-hover:text-primary transition-colors">{g.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{g.description}</p>
          <PosterBadge poster={g.postedBy} />
        </div>
        <div className="col-span-6 sm:col-span-2 sm:text-right">
          <div className="text-2xl text-foreground tabular-nums">{g.budget}</div>
        </div>
        <div className="col-span-6 sm:col-span-2 sm:text-right text-sm text-muted-foreground inline-flex items-center gap-1 sm:justify-end self-center">
          <MapPin className="h-3 w-3" /> {g.location}
        </div>
        <div className="col-span-12 sm:col-span-1 sm:flex sm:items-center sm:justify-end">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
            View <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </button>
    </li>
  );
};

// Renders the "Posted by" badge — distinct treatments for alumni vs LevelUp
const PosterBadge: React.FC<{ poster: Poster }> = ({ poster }) => {
  if (poster.kind === 'levelup') {
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 pl-1 pr-3 py-1">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <img src={forgeIcon} alt="" className="h-3.5 w-auto" />
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className="font-medium text-foreground">{poster.name}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-primary">
            <CheckIcon /> Verified
          </span>
        </span>
      </div>
    );
  }
  return (
    <div className="mt-3 inline-flex items-center gap-2">
      <Avatar className="h-6 w-6 ring-1 ring-border/50">
        <AvatarImage src={poster.avatar} alt={poster.name} />
        <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initialsOf(poster.name)}</AvatarFallback>
      </Avatar>
      <div className="inline-flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">Posted by</span>
        <span className="font-medium text-foreground">{poster.name}</span>
        <span className="text-muted-foreground/50">·</span>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Star className="h-2.5 w-2.5 text-primary" /> Alumni · {poster.cohort}
        </span>
      </div>
    </div>
  );
};

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden>
    <path d="M2.5 6.5l2 2 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- Gig detail + apply modal ----------
type ApplyState = 'detail' | 'applying' | 'sent';

const GigDetailModal: React.FC<{ gig: Gig | null; onClose: () => void }> = ({ gig, onClose }) => {
  const [state, setState] = useState<ApplyState>('detail');
  const [pitch, setPitch] = useState('');
  const [reel, setReel] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const pdfInputRef = React.useRef<HTMLInputElement | null>(null);

  // Reset state when a new gig is opened, or when the modal closes
  React.useEffect(() => {
    if (gig) {
      setState('detail');
      setPitch('');
      setReel('');
      setPdfFile(null);
    }
  }, [gig?.id]);

  // ESC to close
  React.useEffect(() => {
    if (!gig) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [gig, onClose]);

  if (!gig) return null;

  const canSend = pitch.trim().length >= 20;

  const submit = () => {
    if (!canSend) return;
    setState('sent');
  };

  const statusStyles =
    gig.status === 'open' ? 'text-primary border-primary/40' :
    gig.status === 'closing' ? 'text-orange-400 border-orange-500/40' :
    'text-muted-foreground border-border/40';

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="absolute left-1/2 top-1/2 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-border/40 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-border/40 px-6 sm:px-7 py-4">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            {state === 'detail' && 'Open gig'}
            {state === 'applying' && 'Your application'}
            {state === 'sent' && 'Sent'}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-45" />
          </button>
        </header>

        {state === 'detail' && (
          <div className="px-6 sm:px-7 py-7">
            <div className="flex items-center gap-3">
              <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]', statusStyles)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {gig.status}
              </span>
              <span className="text-[11px] text-muted-foreground">{gig.postedAt} ago</span>
              {gig.mode === 'remote' && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">· Remote</span>}
              {gig.mode === 'hybrid' && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">· Hybrid</span>}
            </div>

            <h2 className="font-bold mt-3 text-2xl sm:text-3xl leading-tight tracking-tight text-foreground">{gig.title}</h2>

            <PosterBadge poster={gig.postedBy} />

            <p className="mt-6 text-[15px] leading-[1.65] text-muted-foreground">
              {gig.description}
            </p>

            {/* Meta grid */}
            <div className="mt-7 grid grid-cols-2 gap-3 rounded-2xl border border-border/40 bg-background/40 p-4 sm:grid-cols-4">
              <Meta label="Budget" value={gig.budget} />
              <Meta label="Role" value={gig.role} />
              <Meta label="Type" value={gig.workType} />
              <Meta label="Location" value={gig.location} />
            </div>

            {/* Footer actions */}
            <div className="mt-7 flex items-center justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Verified by LevelUp · Apply directly
              </span>
              <button
                onClick={() => setState('applying')}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]"
              >
                Apply for this gig <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {state === 'applying' && (
          <div className="px-6 sm:px-7 py-7">
            {/* Gig recap */}
            <div className="rounded-2xl border border-border/40 bg-background/40 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Applying to</div>
              <div className="mt-1 text-base text-foreground leading-snug truncate">{gig.title}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{gig.budget} · {gig.location}</div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Your pitch</label>
                <span className="text-[11px] tabular-nums text-muted-foreground/60">{pitch.length}<span className="text-muted-foreground/40">/600</span></span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground/70">A short note — why you, your recent work, your availability.</p>
              <textarea
                autoFocus
                rows={6}
                value={pitch}
                onChange={(e) => setPitch(e.target.value.slice(0, 600))}
                placeholder={`Hi ${gig.postedBy.name.split(' ')[0]} — I'm a ${gig.role.toLowerCase()} based in… My last similar project was…`}
                className="mt-3 w-full resize-none rounded-2xl border border-border/40 bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            <div className="mt-5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Portfolio link (optional)</label>
              <input
                type="url"
                value={reel}
                onChange={(e) => setReel(e.target.value)}
                placeholder="vimeo.com/your-reel · yourportfolio.com"
                className="mt-3 w-full rounded-full border border-border/40 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            <div className="mt-5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Attach a PDF (optional)</label>
              <p className="mt-1.5 text-xs text-muted-foreground/70">Resume, treatment deck, or one-pager. Up to 10 MB.</p>

              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />

              {!pdfFile ? (
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-border/60 bg-background/40 px-4 py-2.5 text-sm text-foreground hover:border-primary/60 hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Choose a PDF
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 px-4 py-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold tracking-wide">
                    PDF
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{pdfFile.name}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {(pdfFile.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPdfFile(null); if (pdfInputRef.current) pdfInputRef.current.value = ''; }}
                    className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground/70 leading-relaxed">
              The poster gets your Circle profile, the pitch above, and any link/PDF attached.
              Replies land in your Forge inbox — track applications under{' '}
              <Link to="/community-redesign/inbox" onClick={onClose} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
                My Inbox
              </Link>.
            </p>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                onClick={() => setState('detail')}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> Back to gig
              </button>
              <button
                onClick={submit}
                disabled={!canSend}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                  canSend
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                Send application <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {state === 'sent' && (
          <div className="px-6 sm:px-7 py-12 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
              <CheckIcon />
            </div>
            <h2 className="font-bold mt-5 text-2xl sm:text-3xl leading-tight tracking-tight text-foreground">
              Application <span className="italic text-primary">sent</span>.
            </h2>
            <p className="mt-3 max-w-xs mx-auto text-sm text-muted-foreground leading-relaxed">
              {gig.postedBy.name} gets your pitch in their Forge inbox. You&apos;ll be notified the moment they reply.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Back to gigs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Meta: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    <div className="mt-1 text-sm text-foreground capitalize">{value}</div>
  </div>
);

// ---------- Chat ----------
const ChatView: React.FC = () => (
  <div className="pt-12">
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.24em] text-primary/80">Group chat</div>
      <h1 className="font-bold mt-3 text-[56px] leading-[0.95] tracking-tight text-foreground">
        The <span className="italic text-primary">talk</span>.
      </h1>
    </div>
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)] min-h-[520px]">
      <aside className="col-span-12 md:col-span-3 rounded-xl border border-border/40 bg-card/60 p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cohort</div>
        <ul className="mt-3 mb-5 space-y-1">
          <li>
            <button className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm bg-primary/10 text-primary">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(41_100%_62%)]" />
                Cohort 04
              </span>
              <span className="text-[10px] tabular-nums">42</span>
            </button>
          </li>
        </ul>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cities</div>
        <ul className="mt-3 space-y-1">
          {[['Mumbai',28],['Bengaluru',19],['Delhi',12],['Chennai',8],['Pune',6]].map(([g,n]) => (
            <li key={g as string}>
              <button className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                  {g}
                </span>
                <span className="text-[10px] tabular-nums">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="col-span-12 md:col-span-6 rounded-xl border border-border/40 bg-card/40 flex flex-col">
        <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Group</div>
            <h3 className="font-bold text-xl text-foreground">Cohort 04</h3>
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(41_100%_62%)]" />
            14 online
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Chat messages render here.
        </div>
        <div className="border-t border-border/40 p-3">
          <input placeholder="Message Cohort 04…" className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
        </div>
      </section>

      <aside className="col-span-12 md:col-span-3 rounded-xl border border-border/40 bg-card/60 p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Online · 14</div>
        <ul className="mt-3 space-y-3">
          {CREATIVES.slice(0,6).map(c => (
            <li key={c.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs">{initialsOf(c.name)}</AvatarFallback>
                </Avatar>
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card shadow-[0_0_6px_hsl(41_100%_62%)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-foreground truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.occupations[0]}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </div>
);

export default CommunityRedesign;
