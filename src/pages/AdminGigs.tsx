import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import forgeLogo from '@/assets/forge-logo.png';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  MapPin,
  MoreVertical,
  Pencil,
  Pin,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';

// ---------- Types ----------
type WorkType = 'paid' | 'collab' | 'mentorship' | 'residency';
type Mode = 'remote' | 'hybrid' | 'onsite';
type PosterKind = 'levelup' | 'sponsor' | 'alumni';
type GigStatus = 'live' | 'pending' | 'scheduled' | 'closed' | 'archived';
type Placement = 'standard' | 'featured' | 'pinned';

type AdminGig = {
  id: string;
  title: string;
  description: string;
  role: string;
  workType: WorkType;
  mode: Mode;
  location: string;
  budget: string;
  poster: {
    kind: PosterKind;
    name: string;
    avatar?: string;
    cohort?: string;
  };
  status: GigStatus;
  placement: Placement;
  applicants: number;
  postedAt: string;
  expiresAt?: string;
};

// ---------- Mock seed ----------
const initialGigs: AdminGig[] = [
  {
    id: 'gL1',
    title: 'Editor for the Cohort 05 graduation reel',
    description: '3-min hype reel pulling from 22 short films. Direct brief from Forge faculty. Two-week delivery.',
    role: 'Editor', workType: 'paid', mode: 'hybrid', location: 'Mumbai / Remote',
    budget: '₹50k flat',
    poster: { kind: 'levelup', name: 'LevelUp Learning' },
    status: 'live', placement: 'featured', applicants: 8,
    postedAt: '12h ago', expiresAt: 'in 14d',
  },
  {
    id: 'gL2',
    title: 'Mentor-in-residence — Cohort 06 directing track',
    description: '8-week residency mentoring 12 first-time directors. For alumni 3+ years out, with at least one festival-track film.',
    role: 'Director', workType: 'residency', mode: 'onsite', location: 'Bengaluru',
    budget: '₹2L stipend',
    poster: { kind: 'levelup', name: 'LevelUp Learning' },
    status: 'live', placement: 'pinned', applicants: 14,
    postedAt: '3d ago', expiresAt: 'in 28d',
  },
  {
    id: 'gS1',
    title: 'DOPs wanted — FX6 documentary series',
    description: 'Sony India — official partnership posting. Six episodes across South India.',
    role: 'DOP', workType: 'paid', mode: 'onsite', location: 'Multi-city',
    budget: '₹65k / day',
    poster: { kind: 'sponsor', name: 'Sony India' },
    status: 'live', placement: 'featured', applicants: 22,
    postedAt: '5d ago', expiresAt: 'in 9d',
  },
  {
    id: 'gS2',
    title: 'Editors for a 4-ep web series',
    description: 'BookMyShow Studios — partnered placement.',
    role: 'Editor', workType: 'paid', mode: 'hybrid', location: 'Bengaluru',
    budget: '₹1.5L per ep',
    poster: { kind: 'sponsor', name: 'BookMyShow Studios' },
    status: 'live', placement: 'featured', applicants: 11,
    postedAt: '6d ago', expiresAt: 'in 8d',
  },
  {
    id: 'g1',
    title: 'DOP for 3-day documentary shoot in Kerala',
    description: 'Looking for someone fluent with a Sony FX6 and naturalistic light.',
    role: 'DOP', workType: 'paid', mode: 'onsite', location: 'Kerala',
    budget: '₹45–60k',
    poster: { kind: 'alumni', name: 'Aanya Mehra', cohort: 'Cohort 04', avatar: 'https://i.pravatar.cc/200?u=aanya-mehra' },
    status: 'live', placement: 'standard', applicants: 3,
    postedAt: '2h ago', expiresAt: 'in 30d',
  },
  {
    id: 'g3',
    title: 'Sound designer for short film (post)',
    description: 'Atmospheric drama, 18 min. Foley + design + mix. Festival cut due in 3 weeks.',
    role: 'Sound', workType: 'paid', mode: 'hybrid', location: 'Mumbai / Remote',
    budget: '₹35k',
    poster: { kind: 'alumni', name: 'Rohan Iyer', cohort: 'Cohort 03', avatar: 'https://i.pravatar.cc/200?u=rohan-iyer' },
    status: 'live', placement: 'standard', applicants: 5,
    postedAt: '1d ago', expiresAt: 'in 5d',
  },
  {
    id: 'gP1',
    title: 'Casting director for Cohort 06 grad films',
    description: 'Draft — needs faculty review before publishing.',
    role: 'Casting', workType: 'paid', mode: 'onsite', location: 'Mumbai',
    budget: '₹40k flat',
    poster: { kind: 'levelup', name: 'LevelUp Learning' },
    status: 'pending', placement: 'standard', applicants: 0,
    postedAt: 'Just now', expiresAt: 'in 30d',
  },
  {
    id: 'gC1',
    title: 'Editor — feature documentary (Cohort 03 alum)',
    description: 'Position filled.',
    role: 'Editor', workType: 'paid', mode: 'onsite', location: 'Goa',
    budget: '₹2L',
    poster: { kind: 'alumni', name: 'Maya Krishnan', cohort: 'Cohort 04', avatar: 'https://i.pravatar.cc/200?u=maya-krishnan' },
    status: 'closed', placement: 'standard', applicants: 9,
    postedAt: '3w ago',
  },
];

// ---------- Page ----------
type Filter = 'all' | GigStatus;
type PosterFilter = 'all' | 'levelup' | 'sponsor' | 'alumni';

const AdminGigs: React.FC = () => {
  const [gigs, setGigs] = useState<AdminGig[]>(initialGigs);
  const [filter, setFilter] = useState<Filter>('all');
  const [posterFilter, setPosterFilter] = useState<PosterFilter>('all');
  const [editing, setEditing] = useState<AdminGig | 'new' | null>(null);

  const counts = useMemo(() => ({
    all: gigs.length,
    live: gigs.filter(g => g.status === 'live').length,
    pending: gigs.filter(g => g.status === 'pending').length,
    closed: gigs.filter(g => g.status === 'closed').length,
    levelup: gigs.filter(g => g.poster.kind === 'levelup').length,
    sponsor: gigs.filter(g => g.poster.kind === 'sponsor').length,
    alumni: gigs.filter(g => g.poster.kind === 'alumni').length,
  }), [gigs]);

  const filtered = useMemo(() => {
    return gigs.filter(g => {
      if (filter !== 'all' && g.status !== filter) return false;
      if (posterFilter !== 'all' && g.poster.kind !== posterFilter) return false;
      return true;
    });
  }, [gigs, filter, posterFilter]);

  const applicantsTotal = gigs.reduce((s, g) => s + g.applicants, 0);

  const handleSave = (g: AdminGig) => {
    setGigs(prev => {
      const exists = prev.find(p => p.id === g.id);
      if (exists) return prev.map(p => p.id === g.id ? g : p);
      return [g, ...prev];
    });
    setEditing(null);
  };

  const handleAction = (id: string, action: 'archive' | 'duplicate' | 'pin' | 'feature' | 'unpin' | 'unfeature' | 'close' | 'reopen') => {
    setGigs(prev => prev.map(g => {
      if (g.id !== id) return g;
      switch (action) {
        case 'archive': return { ...g, status: 'archived' };
        case 'close': return { ...g, status: 'closed' };
        case 'reopen': return { ...g, status: 'live' };
        case 'pin': return { ...g, placement: 'pinned' };
        case 'unpin': return { ...g, placement: 'standard' };
        case 'feature': return { ...g, placement: 'featured' };
        case 'unfeature': return { ...g, placement: 'standard' };
        case 'duplicate': // handled below
          return g;
      }
    }));
    if (action === 'duplicate') {
      const orig = gigs.find(g => g.id === id);
      if (orig) {
        const copy: AdminGig = {
          ...orig,
          id: 'd_' + Math.random().toString(36).slice(2, 8),
          title: orig.title + ' (copy)',
          status: 'pending',
          applicants: 0,
          postedAt: 'Just now',
        };
        setGigs(prev => [copy, ...prev]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <AdminBar />

      <main className="mx-auto w-full max-w-[1400px] px-6 lg:px-12 pb-24 pt-10">
        {/* Header row */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary/80">
              <span className="h-px w-8 bg-primary/40" /> Admin · Gigs
            </div>
            <h1 className="font-bold mt-2 text-[40px] sm:text-[48px] leading-[1.02] tracking-tight text-foreground">
              Gigs <span className="italic text-primary">management</span>.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
              Post on behalf of LevelUp Learning, sponsored partners, or moderate alumni-submitted gigs before they go live.
            </p>
          </div>

          <button
            onClick={() => setEditing('new')}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.6)]"
          >
            <Plus className="h-4 w-4" /> New gig
          </button>
        </header>

        {/* Stat row */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Live gigs" value={counts.live} accent />
          <Stat label="Pending review" value={counts.pending} />
          <Stat label="Total applicants" value={applicantsTotal} />
          <Stat label="Posted by LevelUp" value={counts.levelup} />
        </section>

        {/* Filter bars */}
        <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all} />
            <FilterChip label="Live" active={filter === 'live'} onClick={() => setFilter('live')} count={counts.live} dotColor="text-primary" />
            <FilterChip label="Pending" active={filter === 'pending'} onClick={() => setFilter('pending')} count={counts.pending} dotColor="text-orange-400" />
            <FilterChip label="Closed" active={filter === 'closed'} onClick={() => setFilter('closed')} count={counts.closed} dotColor="text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SmallPill label="All posters" active={posterFilter === 'all'} onClick={() => setPosterFilter('all')} />
            <SmallPill label={`LevelUp (${counts.levelup})`} active={posterFilter === 'levelup'} onClick={() => setPosterFilter('levelup')} />
            <SmallPill label={`Sponsors (${counts.sponsor})`} active={posterFilter === 'sponsor'} onClick={() => setPosterFilter('sponsor')} />
            <SmallPill label={`Alumni (${counts.alumni})`} active={posterFilter === 'alumni'} onClick={() => setPosterFilter('alumni')} />
          </div>
        </section>

        {/* Table */}
        <section className="mt-6 rounded-2xl border border-border/40 bg-card/40 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <div className="col-span-5">Gig</div>
            <div className="col-span-3">Posted by</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-center">Placement</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-foreground">No gigs match these filters.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {filtered.map(g => (
                <AdminGigRow
                  key={g.id}
                  gig={g}
                  onEdit={() => setEditing(g)}
                  onAction={(a) => handleAction(g.id, a)}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Tip footer */}
        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          LevelUp + sponsor posts skip alumni-review and go live instantly · Alumni posts queue for moderation
        </p>
      </main>

      {/* Edit / new modal */}
      {editing && (
        <GigEditor
          gig={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// ---------- Admin top bar ----------
const AdminBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-12">
        <div className="flex items-center gap-5">
          <Link to="/community-redesign" className="flex items-center">
            <img src={forgeLogo} alt="The Forge" className="h-6 w-auto" />
          </Link>
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Admin</span>
        </div>
        <nav className="hidden sm:flex items-center gap-1 text-[11px] uppercase tracking-[0.18em]">
          <button className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
          <button className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">Alumni</button>
          <button className="rounded-full bg-primary/10 text-primary px-3 py-1.5">Gigs</button>
          <button className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">Cohorts</button>
          <button className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">Sponsors</button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/community-redesign')}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live
          </button>
        </div>
      </div>
    </header>
  );
};

// ---------- Stat tile ----------
const Stat: React.FC<{ label: string; value: number | string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={cn(
    'rounded-2xl border bg-card/40 p-4',
    accent ? 'border-primary/30' : 'border-border/40'
  )}>
    <div className={cn('text-3xl tabular-nums', accent ? 'text-primary' : 'text-foreground')}>{value}</div>
    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
  </div>
);

// ---------- Filter chips ----------
const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void; count: number; dotColor?: string }> = ({ label, active, onClick, count, dotColor }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
      active
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border/40 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
    )}
  >
    {dotColor && <span className={cn('h-1.5 w-1.5 rounded-full bg-current', dotColor)} />}
    {label}
    <span className="tabular-nums text-muted-foreground/70">{count}</span>
  </button>
);

const SmallPill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-all',
      active
        ? 'border-primary/60 text-primary bg-primary/5'
        : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
    )}
  >
    {label}
  </button>
);

// ---------- Row ----------
const AdminGigRow: React.FC<{
  gig: AdminGig;
  onEdit: () => void;
  onAction: (a: 'archive' | 'duplicate' | 'pin' | 'feature' | 'unpin' | 'unfeature' | 'close' | 'reopen') => void;
}> = ({ gig, onEdit, onAction }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  return (
    <li className="grid grid-cols-12 gap-4 px-5 py-4 transition-colors hover:bg-card/40">
      {/* Gig title */}
      <div className="col-span-5 min-w-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{gig.role}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{gig.budget}</span>
          {gig.mode === 'remote' && <span>· Remote</span>}
          {gig.mode === 'hybrid' && <span>· Hybrid</span>}
        </div>
        <div className="mt-1 text-base text-foreground truncate">{gig.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {gig.location}
          <span className="text-muted-foreground/40">·</span>
          <span>{gig.postedAt}</span>
          {gig.expiresAt && <><span className="text-muted-foreground/40">·</span> <span>Expires {gig.expiresAt}</span></>}
        </div>
      </div>

      {/* Poster */}
      <div className="col-span-3 flex items-center min-w-0">
        <PosterCell poster={gig.poster} />
      </div>

      {/* Status */}
      <div className="col-span-1 flex items-center justify-center">
        <StatusPill status={gig.status} />
      </div>

      {/* Placement */}
      <div className="col-span-2 flex items-center justify-center">
        <PlacementPill placement={gig.placement} />
      </div>

      {/* Actions */}
      <div ref={wrapRef} className="col-span-1 flex items-center justify-end relative">
        <button
          onClick={onEdit}
          aria-label="Edit"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-primary transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="More actions"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 z-20 w-56 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
            <ul className="py-1 text-sm">
              {gig.placement !== 'featured' && (
                <MenuItem icon={<Sparkles className="h-3.5 w-3.5" />} onClick={() => { onAction('feature'); setMenuOpen(false); }}>
                  Feature in stack
                </MenuItem>
              )}
              {gig.placement === 'featured' && (
                <MenuItem icon={<EyeOff className="h-3.5 w-3.5" />} onClick={() => { onAction('unfeature'); setMenuOpen(false); }}>
                  Remove from stack
                </MenuItem>
              )}
              {gig.placement !== 'pinned' && (
                <MenuItem icon={<Pin className="h-3.5 w-3.5" />} onClick={() => { onAction('pin'); setMenuOpen(false); }}>
                  Pin to top
                </MenuItem>
              )}
              {gig.placement === 'pinned' && (
                <MenuItem icon={<Pin className="h-3.5 w-3.5" />} onClick={() => { onAction('unpin'); setMenuOpen(false); }}>
                  Unpin
                </MenuItem>
              )}
              <MenuItem icon={<Eye className="h-3.5 w-3.5" />} onClick={() => { onAction('duplicate'); setMenuOpen(false); }}>
                Duplicate as draft
              </MenuItem>
              {gig.status === 'live' && (
                <MenuItem icon={<X className="h-3.5 w-3.5" />} onClick={() => { onAction('close'); setMenuOpen(false); }}>
                  Mark as filled
                </MenuItem>
              )}
              {gig.status === 'closed' && (
                <MenuItem icon={<Check className="h-3.5 w-3.5" />} onClick={() => { onAction('reopen'); setMenuOpen(false); }}>
                  Re-open
                </MenuItem>
              )}
              <div className="my-1 border-t border-border/40" />
              <MenuItem icon={<Trash2 className="h-3.5 w-3.5" />} danger onClick={() => { onAction('archive'); setMenuOpen(false); }}>
                Archive
              </MenuItem>
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode; onClick: () => void; danger?: boolean; children: React.ReactNode }> = ({ icon, onClick, danger, children }) => (
  <li>
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors',
        danger ? 'text-destructive/90 hover:bg-destructive/10' : 'text-foreground hover:bg-card hover:text-primary'
      )}
    >
      {icon} {children}
    </button>
  </li>
);

const PosterCell: React.FC<{ poster: AdminGig['poster'] }> = ({ poster }) => {
  if (poster.kind === 'levelup') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
          <span className="text-[10px] font-bold tracking-tight">LU</span>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-foreground truncate">LevelUp</div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-primary">Official</div>
        </div>
      </div>
    );
  }
  if (poster.kind === 'sponsor') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-sm text-foreground truncate">{poster.name}</div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Sponsored</div>
        </div>
      </div>
    );
  }
  // alumni
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border/50">
        <AvatarImage src={poster.avatar} />
        <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
          {poster.name.split(' ').map(n => n[0]).join('').slice(0,2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="text-sm text-foreground truncate">{poster.name}</div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center gap-1">
          <Star className="h-2.5 w-2.5 text-primary" /> {poster.cohort}
        </div>
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ status: GigStatus }> = ({ status }) => {
  const map = {
    live: { label: 'Live', color: 'text-primary border-primary/40' },
    pending: { label: 'Pending', color: 'text-orange-400 border-orange-500/40' },
    scheduled: { label: 'Scheduled', color: 'text-blue-400 border-blue-500/40' },
    closed: { label: 'Closed', color: 'text-muted-foreground border-border/40' },
    archived: { label: 'Archived', color: 'text-muted-foreground/60 border-border/30' },
  } as const;
  const it = map[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]', it.color)}>
      <span className="h-1 w-1 rounded-full bg-current" /> {it.label}
    </span>
  );
};

const PlacementPill: React.FC<{ placement: Placement }> = ({ placement }) => {
  if (placement === 'standard') {
    return <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">Standard</span>;
  }
  if (placement === 'featured') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-primary">
        <Sparkles className="h-2.5 w-2.5" /> Featured
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-primary">
      <Pin className="h-2.5 w-2.5" /> Pinned
    </span>
  );
};

// ---------- Editor modal ----------
const GigEditor: React.FC<{
  gig: AdminGig | null;
  onClose: () => void;
  onSave: (g: AdminGig) => void;
}> = ({ gig, onClose, onSave }) => {
  const isNew = !gig;
  const [draft, setDraft] = useState<AdminGig>(gig ?? {
    id: 'n_' + Math.random().toString(36).slice(2, 8),
    title: '', description: '',
    role: '', workType: 'paid', mode: 'onsite', location: '', budget: '',
    poster: { kind: 'levelup', name: 'LevelUp Learning' },
    status: 'live', placement: 'standard', applicants: 0,
    postedAt: 'Just now', expiresAt: 'in 30d',
  });

  const update = <K extends keyof AdminGig>(k: K, v: AdminGig[K]) =>
    setDraft(prev => ({ ...prev, [k]: v }));

  const updatePoster = (kind: PosterKind, name?: string) => {
    if (kind === 'levelup') {
      setDraft(prev => ({ ...prev, poster: { kind, name: 'LevelUp Learning' } }));
    } else if (kind === 'sponsor') {
      setDraft(prev => ({ ...prev, poster: { kind, name: name ?? prev.poster.name } }));
    }
  };

  const isValid = draft.title.trim().length >= 4 && draft.role && draft.budget && (draft.mode === 'remote' || draft.location);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 text-foreground">
      <div className="relative flex h-[min(820px,calc(100dvh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border/40 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Top */}
        <header className="flex items-center justify-between gap-3 border-b border-border/40 px-6 sm:px-8 py-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            {isNew ? 'New gig' : 'Edit gig'}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-7 space-y-6">
          {/* Post as */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">— Post as</div>
            <p className="mt-1 text-xs text-muted-foreground/80">Who appears as the poster on the public Gigs board.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <PosterChoice
                active={draft.poster.kind === 'levelup'}
                onClick={() => updatePoster('levelup')}
                title="LevelUp Learning"
                helper="Official badge · Auto-verified · Pinned eligible"
                icon={<div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary text-[11px] font-bold">LU</div>}
              />
              <PosterChoice
                active={draft.poster.kind === 'sponsor'}
                onClick={() => updatePoster('sponsor', draft.poster.kind === 'sponsor' ? draft.poster.name : 'Sony India')}
                title="Sponsor"
                helper="Branded partner placement"
                icon={<div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/40 text-primary"><Sparkles className="h-4 w-4" /></div>}
              />
            </div>
            {draft.poster.kind === 'sponsor' && (
              <div className="mt-3">
                <TextInput
                  label="Sponsor name"
                  placeholder="e.g. Sony India, BookMyShow Studios"
                  value={draft.poster.name}
                  onChange={(v) => setDraft(prev => ({ ...prev, poster: { kind: 'sponsor', name: v } }))}
                />
              </div>
            )}
          </section>

          {/* Role + work type */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Role">
              <SimpleSelect
                value={draft.role}
                placeholder="Pick a role…"
                options={['Director','DOP','Editor','Colorist','Writer','Producer','Sound','Composer','AD','Designer','Production Designer','VFX','Casting','Photographer','Creator','Podcaster']}
                onChange={(v) => update('role', v)}
              />
            </FieldGroup>
            <FieldGroup label="Work type">
              <SimpleSelect
                value={draft.workType}
                placeholder="Pick a type"
                options={['paid','collab','mentorship','residency']}
                onChange={(v) => update('workType', v as WorkType)}
              />
            </FieldGroup>
          </section>

          {/* Mode + location */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Mode">
              <div className="grid grid-cols-3 gap-2">
                {(['remote','hybrid','onsite'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => update('mode', m)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-all',
                      draft.mode === m
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/40 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </FieldGroup>
            <FieldGroup label="Location">
              <TextInput
                placeholder={draft.mode === 'remote' ? 'Remote — no city needed' : 'e.g. Mumbai, Bengaluru, Multi-city'}
                value={draft.location}
                onChange={(v) => update('location', v)}
              />
            </FieldGroup>
          </section>

          {/* Title + description */}
          <FieldGroup label="Title">
            <TextInput
              placeholder="e.g. Editor for Cohort 05 graduation reel"
              value={draft.title}
              onChange={(v) => update('title', v.slice(0, 90))}
              maxLength={90}
            />
          </FieldGroup>
          <FieldGroup label="Description">
            <textarea
              rows={4}
              value={draft.description}
              maxLength={400}
              onChange={e => update('description', e.target.value.slice(0, 400))}
              placeholder="What the gig is, the dates, the kit, who's a good fit."
              className="w-full resize-none rounded-2xl border border-border/40 bg-card/40 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
            />
            <div className="mt-1 text-right text-[11px] tabular-nums text-muted-foreground/60">
              {draft.description.length}<span className="text-muted-foreground/40">/400</span>
            </div>
          </FieldGroup>

          {/* Budget */}
          <FieldGroup label="Budget">
            <TextInput
              placeholder="e.g. ₹50k flat, ₹65k/day, Profit share + credit"
              value={draft.budget}
              onChange={(v) => update('budget', v.slice(0, 60))}
              maxLength={60}
            />
          </FieldGroup>

          {/* Admin-only — placement + schedule */}
          <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary">
              <Star className="h-3 w-3" /> Admin · placement & schedule
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Placement">
                <div className="grid grid-cols-3 gap-2">
                  {(['standard','featured','pinned'] as Placement[]).map(p => (
                    <button
                      key={p}
                      onClick={() => update('placement', p)}
                      className={cn(
                        'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-all',
                        draft.placement === p
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border/40 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground/80">
                  {draft.placement === 'standard' && 'Appears in the regular gigs list.'}
                  {draft.placement === 'featured' && 'Also rotates in the homepage stack carousel.'}
                  {draft.placement === 'pinned' && 'Sticky at the top of the list for 7 days.'}
                </p>
              </FieldGroup>

              <FieldGroup label="Status">
                <div className="grid grid-cols-3 gap-2">
                  {(['live','pending','scheduled'] as GigStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => update('status', s)}
                      className={cn(
                        'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-all',
                        draft.status === s
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border/40 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FieldGroup>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Expires">
                <TextInput
                  placeholder="e.g. in 30d, in 14d, never"
                  value={draft.expiresAt ?? ''}
                  onChange={(v) => update('expiresAt', v)}
                />
              </FieldGroup>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-card">
          <div className="flex items-center justify-between gap-3 px-6 sm:px-8 py-4">
            <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {draft.poster.kind === 'alumni' ? 'Queues for review' : 'Goes live instantly'}
              </span>
              <button
                onClick={() => isValid && onSave(draft)}
                disabled={!isValid}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                  isValid
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.6)]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {isNew ? 'Publish gig' : 'Save changes'} <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ---------- Reusable form bits ----------
const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
    <div className="mt-2">{children}</div>
  </div>
);

const TextInput: React.FC<{ label?: string; placeholder?: string; value: string; onChange: (v: string) => void; maxLength?: number }> = ({ label, placeholder, value, onChange, maxLength }) => (
  <div>
    {label && (
      <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground block mb-2">{label}</label>
    )}
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full rounded-2xl border border-border/40 bg-card/40 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors"
    />
  </div>
);

const PosterChoice: React.FC<{ active: boolean; onClick: () => void; title: string; helper: string; icon: React.ReactNode }> = ({ active, onClick, title, helper, icon }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 rounded-2xl border p-3 text-left transition-all',
      active
        ? 'border-primary/60 bg-primary/10 shadow-[0_4px_16px_-6px_hsl(41_100%_62%/0.4)]'
        : 'border-border/40 bg-card/40 hover:border-primary/30'
    )}
  >
    {icon}
    <div className="flex-1 min-w-0">
      <div className={cn('text-sm font-medium', active ? 'text-primary' : 'text-foreground')}>{title}</div>
      <div className="text-[11px] text-muted-foreground">{helper}</div>
    </div>
    {active && <Check className="h-4 w-4 text-primary" />}
  </button>
);

// Simple custom dark dropdown (reuses pattern from CommunityPostGig)
const SimpleSelect: React.FC<{
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ value, placeholder, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-2xl border bg-card/40 px-4 py-3 text-base transition-all',
          value ? 'border-primary/60 text-foreground' : 'border-border/40 text-muted-foreground/60',
          open && 'ring-2 ring-primary/30'
        )}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[260px] overflow-y-auto rounded-2xl border border-border/50 bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
          <ul className="py-1">
            {options.map(o => {
              const selected = o === value;
              return (
                <li key={o}>
                  <button
                    type="button"
                    onClick={() => { onChange(o); setOpen(false); }}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      selected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-card hover:text-primary'
                    )}
                  >
                    <span>{o}</span>
                    {selected && <Check className="h-3.5 w-3.5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminGigs;
