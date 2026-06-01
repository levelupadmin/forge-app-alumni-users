import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import forgeLogo from '@/assets/forge-logo.png';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Mail,
  Plus,
  Share2,
  Briefcase,
  Bell,
  Flame,
  Play,
  ArrowUpRight,
  Globe,
  Instagram,
  Calendar,
  Star,
  Lock,
} from 'lucide-react';

// Mock signed-in state stored in localStorage.
// Set when a user finishes onboarding OR signs in as a returning alum w/ complete profile.
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

// --- Mock creatives (kept in sync with CommunityRedesign) ---
const portrait = (seed: string) => `https://i.pravatar.cc/600?u=${encodeURIComponent(seed)}`;

type Creative = {
  id: string;
  name: string;
  tagline: string;
  city: string;
  occupations: string[];
  available: boolean;
  works: number;
  cohort: string;
  avatar: string;
  email: string;
  bio: string;
  website?: string;
  instagram?: string;
  joined: string;
};

const CREATIVES: Record<string, Creative> = {
  '1': { id:'1', name:'Aanya Mehra', tagline:'Directing intimate documentaries about Indian craft.', city:'Mumbai', occupations:['Director','DOP'], available:true, works:12, cohort:'Cohort 04', avatar: portrait('aanya-mehra'), email:'aanya@theforge.in', bio:"Independent documentary filmmaker working between Mumbai and the Western Ghats. I'm drawn to stories about people who make things with their hands — weavers, instrument-makers, ship-breakers. Currently in post on a 35-min film about toy-makers in Channapatna.", website:'aanyamehra.in', instagram:'aanya.mehra', joined:'Jan 2024' },
  '2': { id:'2', name:'Rohan Iyer', tagline:'Editor / Colorist — long-form & branded.', city:'Bengaluru', occupations:['Editor','Colorist'], available:true, works:24, cohort:'Cohort 03', avatar: portrait('rohan-iyer'), email:'rohan@theforge.in', bio:"Cutting room first, color suite second. I've edited two indie features and a stack of branded work — Nike, Decathlon, Bira. Premiere → Resolve → finished delivery. Available for project work and short residencies.", website:'rohan-iyer.com', joined:'Aug 2023' },
  '3': { id:'3', name:'Shruti Pillai', tagline:'Writes screenplays you can taste.', city:'Mumbai', occupations:['Writer'], available:false, works:6, cohort:'Cohort 04', avatar: portrait('shruti-pillai'), email:'shruti@theforge.in', bio:"Screenwriter — features and limited series. My work is set in coastal India and tends to revolve around food, families, and the slow violence of inheritance. Currently in pre-production on a Kerala-set drama.", instagram:'shruti.writes', joined:'Feb 2024' },
  '4': { id:'4', name:'Kabir Ahmed', tagline:'Sound design, scoring, foley. Loves rain.', city:'Delhi', occupations:['Sound','Composer'], available:true, works:18, cohort:'Cohort 02', avatar: portrait('kabir-ahmed'), email:'kabir@theforge.in', bio:"Sound designer + composer based in Delhi. I score for short films, ad work, and the occasional theatre piece. Big believer in foley as character work.", website:'kabirsound.in', joined:'Mar 2023' },
  '5': { id:'5', name:'Maya Krishnan', tagline:'Producer — short films, music videos, ads.', city:'Chennai', occupations:['Producer'], available:true, works:31, cohort:'Cohort 04', avatar: portrait('maya-krishnan'), email:'maya@theforge.in', bio:"Line producer turned creative producer. I run shoots from one-day music videos to month-long features. Tamil, English, Hindi sets. Tight schedules don't scare me; bad scripts do.", joined:'Jan 2024' },
  '6': { id:'6', name:'Arjun Bose', tagline:'Photographer pretending to be a cinematographer.', city:'Kolkata', occupations:['Photographer','DOP'], available:false, works:9, cohort:'Cohort 03', avatar: portrait('arjun-bose'), email:'arjun@theforge.in', bio:"Stills photographer crossing into motion. Available light, slow zooms, faces.", instagram:'arjun.bose', joined:'Sep 2023' },
  '7': { id:'7', name:'Neha Raghavan', tagline:'Visual design + motion. Loud and tactile.', city:'Mumbai', occupations:['Designer','Motion'], available:true, works:14, cohort:'Cohort 04', avatar: portrait('neha-raghavan'), email:'neha@theforge.in', bio:"Brand & motion designer. Type-first work for music labels, indie publishers, and one extremely patient food brand.", website:'neha.studio', joined:'Feb 2024' },
  '8': { id:'8', name:'Ishaan Verma', tagline:'AD and 1st AD on indie sets.', city:'Pune', occupations:['AD'], available:true, works:11, cohort:'Cohort 02', avatar: portrait('ishaan-verma'), email:'ishaan@theforge.in', bio:"AD on indie sets across Maharashtra & Goa. Known for clean call sheets and zero overtime.", joined:'Apr 2023' },
  '9': { id:'9', name:'Tara Sen', tagline:'Production designer. Loves period sets.', city:'Mumbai', occupations:['Production Designer'], available:true, works:8, cohort:'Cohort 03', avatar: portrait('tara-sen'), email:'tara@theforge.in', bio:"Production designer with a soft spot for the 80s. Sourcing-obsessed. Frequent collaborator with Aanya Mehra.", joined:'Oct 2023' },
  '10': { id:'10', name:'Devansh Roy', tagline:'VFX / compositor. Nuke & Fusion.', city:'Hyderabad', occupations:['VFX'], available:false, works:22, cohort:'Cohort 01', avatar: portrait('devansh-roy'), email:'devansh@theforge.in', bio:"Senior compositor working out of Hyderabad. Five years in features, now picking shorter projects with cleaner briefs.", joined:'May 2022' },
  '11': { id:'11', name:'Aditi Nair', tagline:'Casting & talent for indie features.', city:'Mumbai', occupations:['Casting'], available:true, works:17, cohort:'Cohort 04', avatar: portrait('aditi-nair'), email:'aditi@theforge.in', bio:"Casting director — indie features, ads, the occasional series. Open call DM is genuinely open.", instagram:'aditi.casts', joined:'Feb 2024' },
  '12': { id:'12', name:'Vikram Joshi', tagline:'Music video director. Bold colour, bold cuts.', city:'Delhi', occupations:['Director'], available:true, works:13, cohort:'Cohort 03', avatar: portrait('vikram-joshi'), email:'vikram@theforge.in', bio:"Music videos & brand work. The louder the better.", website:'vikramjoshi.tv', joined:'Aug 2023' },
};

type Work = {
  id: string;
  title: string;
  type: 'Film' | 'Short' | 'Music Video' | 'Ad' | 'Photo Series' | 'Doc';
  year: string;
  duration?: string;
  role: string;
  thumb: string;
  status?: 'new' | 'featured';
};

const WORKS_BY_CREATIVE: Record<string, Work[]> = {
  '1': [
    { id:'w1', title:'Wood, Lacquer, Hand', type:'Doc', year:'2025', duration:'34:12', role:'Director / DOP', thumb:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', status:'featured' },
    { id:'w2', title:'Tea Estate Mornings', type:'Short', year:'2024', duration:'08:40', role:'Director', thumb:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800' },
    { id:'w3', title:'Salt & Time', type:'Doc', year:'2024', duration:'22:00', role:'Director', thumb:'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800' },
    { id:'w4', title:'The Last Boat in Cochin', type:'Doc', year:'2023', duration:'17:20', role:'Director / DOP', thumb:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { id:'w5', title:'After the Loom', type:'Short', year:'2023', duration:'11:05', role:'Director', thumb:'https://images.unsplash.com/photo-1531030874896-fdef6826f2f8?w=800', status:'new' },
    { id:'w6', title:'Things My Mother Knows', type:'Short', year:'2023', duration:'14:30', role:'Director / Writer', thumb:'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800' },
  ],
};

const DEFAULT_WORKS: Work[] = [
  { id:'w1', title:'Untitled #1', type:'Short', year:'2025', duration:'06:12', role:'—', thumb:'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800' },
  { id:'w2', title:'Untitled #2', type:'Ad', year:'2024', duration:'00:60', role:'—', thumb:'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800' },
  { id:'w3', title:'Untitled #3', type:'Music Video', year:'2024', duration:'03:40', role:'—', thumb:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
  { id:'w4', title:'Untitled #4', type:'Photo Series', year:'2023', duration:'—', role:'—', thumb:'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800' },
];

// Standardised covers, keyed by craft group. Every occupation maps to one of these,
// so all directors share a cover, all editors share one, etc.
const COVER_GROUPS = {
  visual:     { img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=2000', label: 'On set' },
  post:       { img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=2000', label: 'Post' },
  audio:      { img: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=2000', label: 'Studio' },
  words:      { img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=2000', label: 'Writers room' },
  production: { img: 'https://images.unsplash.com/photo-1542204625-ca960aabb8e7?w=2000', label: 'Production' },
  design:     { img: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=2000', label: 'Studio' },
  vfx:        { img: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=2000', label: 'VFX bay' },
} as const;

type CoverKey = keyof typeof COVER_GROUPS;

const OCCUPATION_TO_GROUP: Record<string, CoverKey> = {
  Director: 'visual',
  DOP: 'visual',
  Photographer: 'visual',
  'Production Designer': 'visual',
  Editor: 'post',
  Colorist: 'post',
  VFX: 'vfx',
  Sound: 'audio',
  Composer: 'audio',
  Writer: 'words',
  Producer: 'production',
  AD: 'production',
  Casting: 'production',
  Designer: 'design',
  Motion: 'design',
};

const coverFor = (occupations: string[]): { img: string; label: string; key: CoverKey } => {
  const first = occupations[0];
  const key = (OCCUPATION_TO_GROUP[first] ?? 'visual') as CoverKey;
  return { ...COVER_GROUPS[key], key };
};

const initialsOf = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// --- Page ---
const CreativeProfile: React.FC = () => {
  const { id = '1' } = useParams();
  const navigate = useNavigate();
  const c = CREATIVES[id] ?? CREATIVES['1'];
  const works = WORKS_BY_CREATIVE[c.id] ?? DEFAULT_WORKS;
  const cover = coverFor(c.occupations);
  const profileComplete = useProfileComplete();

  // Gate: must have a complete own-profile before viewing other alumni's profiles.
  if (!profileComplete) {
    return <ProfileGate viewing={c.name} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <TopBar onBack={() => navigate('/community-redesign')} />

      {/* Hero banner — standardised cover per craft group */}
      <div className="relative h-[320px] overflow-hidden md:h-[380px]">
        <img src={cover.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-background/50 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,hsl(41_100%_62%/0.18),transparent_55%)]" />
        {/* Craft-group chip on the cover */}
        <div className="absolute right-6 top-6 lg:right-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(41_100%_62%)]" />
            {cover.label} · {c.occupations[0]}
          </span>
        </div>
      </div>

      <main className="mx-auto -mt-24 grid w-full max-w-[1400px] grid-cols-12 gap-6 px-6 lg:px-12 pb-32 md:-mt-28">
        {/* Left sidebar */}
        <aside className="col-span-12 space-y-4 lg:col-span-4">
          {/* Profile card */}
          <section className="relative rounded-2xl border border-border/40 bg-card/95 p-6 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            <button
              aria-label="Share"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="relative h-28 w-28 -mt-16 overflow-hidden rounded-full ring-4 ring-card shadow-2xl">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 text-3xl text-primary">{initialsOf(c.name)}</div>
                )}
              </div>
              {c.available && (
                <span className="absolute -bottom-1 left-20 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-card shadow-[0_0_10px_hsl(41_100%_62%)]">
                  <span className="h-2 w-2 rounded-full bg-background animate-pulse" />
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground">{c.name}</h1>
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {c.city}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{c.bio}</p>

            <div className="mt-6 space-y-3 border-t border-border/40 pt-5 text-sm">
              <div className="flex items-center gap-3 text-foreground/90">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${c.email}`} className="hover:text-primary transition-colors">{c.email}</a>
              </div>
              {c.website && (
                <div className="flex items-center gap-3 text-foreground/90">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{c.website}</a>
                </div>
              )}
              {c.instagram && (
                <div className="flex items-center gap-3 text-foreground/90">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  <span className="hover:text-primary transition-colors cursor-pointer">@{c.instagram}</span>
                </div>
              )}
              <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Plus className="h-4 w-4" /> Add link
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]">
                Message
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-background/30 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary">
                Follow
              </button>
            </div>
          </section>

          {/* Availability card */}
          <section className="rounded-2xl border border-border/40 bg-card/60 p-6">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              c.available ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              <Briefcase className="h-4 w-4" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">
              {c.available ? 'Available for Hire' : 'Not Available for Hire'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {c.available
                ? `${c.name.split(' ')[0]} is open to project work and listed in the Forge professional network.`
                : `${c.name.split(' ')[0]} is currently busy. Send a message to ask about future availability.`}
            </p>
            <button className={cn(
              'mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
              c.available
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-border/60 text-foreground hover:border-primary/60 hover:text-primary'
            )}>
              {c.available ? 'Hire ' + c.name.split(' ')[0] : 'Request availability'}
            </button>
          </section>

          {/* Roles card */}
          <section className="rounded-2xl border border-border/40 bg-card/60 p-6">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Roles</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.occupations.map(o => (
                <span key={o} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/30 px-3 py-1.5 text-xs font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {o}
                </span>
              ))}
              <button className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors">
                <Plus className="h-3 w-3" /> Add role
              </button>
            </div>
          </section>

        </aside>

        {/* Right main */}
        <section className="col-span-12 lg:col-span-8">
          {/* Sub-nav tabs */}
          <div className="mt-4 flex items-end justify-between border-b border-border/40">
            <ul className="flex gap-8">
              <li><button className="relative pb-3 text-sm font-semibold text-foreground">
                Works
                <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_hsl(41_100%_62%/0.7)]" />
              </button></li>
              <li><button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</button></li>
              <li><button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Credits</button></li>
              <li><button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Gigs posted</button></li>
            </ul>
            <div className="hidden sm:flex items-center gap-2 pb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Sort:</span>
              <button className="text-foreground border-b border-primary pb-0.5">Newest</button>
              <span className="text-muted-foreground/40">·</span>
              <button className="hover:text-foreground transition-colors">Most viewed</button>
            </div>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Works
            <span className="ml-3 text-sm font-normal text-muted-foreground">— shot, cut, scored, or shipped by {c.name.split(' ')[0]}.</span>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {works.map((w, i) => (
              <WorkCard key={w.id} w={w} feature={i === 0} />
            ))}
          </div>

          {/* Empty CTA at bottom */}
          <div className="mt-10 flex items-center justify-between rounded-2xl border border-dashed border-border/50 bg-card/30 p-6">
            <div>
              <div className="text-sm font-semibold text-foreground">Want to see more of {c.name.split(' ')[0]}&apos;s work?</div>
              <div className="mt-1 text-xs text-muted-foreground">Request a private reel — shows unlisted projects and works-in-progress.</div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Request reel <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- Top bar ---
// ---------- Profile gate ----------
// Shown to users who haven't completed their own profile yet.
// They can't browse other alumni until they set theirs up.
const ProfileGate: React.FC<{ viewing: string }> = ({ viewing }) => (
  <div className="min-h-screen bg-background text-foreground font-sans antialiased flex items-center justify-center px-6">
    {/* Ambient amber */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(41_100%_62%/0.12),transparent_70%)] blur-3xl" />
    </div>

    <div className="relative w-full max-w-md text-center">
      <Link to="/community-redesign/landing" className="inline-flex items-center mb-12">
        <img src={forgeLogo} alt="The Forge" className="h-7 w-auto" />
      </Link>

      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
        <Lock className="h-7 w-7" />
      </div>

      <h1 className="font-bold mt-7 text-[36px] sm:text-[44px] leading-[1.02] tracking-tight text-foreground">
        Set up <span className="italic text-primary">your card</span> first.
      </h1>

      <p className="mt-4 max-w-sm mx-auto text-sm text-muted-foreground leading-relaxed">
        To see <span className="text-foreground">{viewing}</span>&apos;s profile — and
        any other Forge alum&apos;s — you need to fill in your own first.
        Two minutes. Everyone in the Circle is verified.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3">
        <Link
          to="/community-redesign/onboarding?required=true"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]"
        >
          Set up profile <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/community-redesign"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-[6px] decoration-white/20 hover:decoration-white/60"
        >
          Back to the Circle
        </Link>
      </div>

      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">
        Required · Two-way street, the Forge
      </p>
    </div>
  </div>
);

const TopBar: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
    <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-12">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> The Circle
      </button>
      <div className="flex items-center gap-3">
        <Flame className="h-4 w-4 text-primary" />
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">The Forge</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
          Edit profile
        </button>
        <button
          aria-label="Inbox"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-card/60 text-foreground backdrop-blur transition-all hover:border-primary/40 hover:text-primary"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(41_100%_62%)]" />
        </button>
      </div>
    </div>
  </header>
);

// --- Work card ---
const WorkCard: React.FC<{ w: Work; feature?: boolean }> = ({ w, feature }) => (
  <article className={cn(
    'group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-primary/40 hover:-translate-y-0.5',
    feature && 'sm:col-span-2'
  )}>
    <div className={cn('relative overflow-hidden', feature ? 'aspect-[16/8]' : 'aspect-video')}>
      <img src={w.thumb} alt={w.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute left-4 top-4 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
          {w.type}
        </span>
        {w.status === 'featured' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Star className="h-2.5 w-2.5" /> Featured
          </span>
        )}
        {w.status === 'new' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> New
          </span>
        )}
      </div>


      {/* Play button */}
      <button
        aria-label={`Play ${w.title}`}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-[0_0_30px_hsl(41_100%_62%/0.5)] transition-transform duration-300 group-hover:scale-110">
          <Play className="h-5 w-5 translate-x-0.5 fill-current" />
        </span>
      </button>

      {/* Bottom title overlay (visible on hover) */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-bold leading-tight text-white">{w.title}</h3>
        <div className="mt-1 text-xs text-white/70">{w.role}</div>
      </div>
    </div>
  </article>
);

export default CreativeProfile;
