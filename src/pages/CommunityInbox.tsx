import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import forgeLogo from '@/assets/forge-logo.png';
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  Inbox,
  MessageCircle,
  Send,
  Star,
  Users,
  Circle,
} from 'lucide-react';

// ---------- Mock data ----------
const portrait = (seed: string) =>
  `https://i.pravatar.cc/400?u=${encodeURIComponent(seed)}`;

type AppStatus = 'pending' | 'replied' | 'shortlisted' | 'declined' | 'filled';

type Application = {
  id: string;
  gig: { title: string; budget: string; location: string; mode: 'remote' | 'hybrid' | 'onsite' };
  to: { name: string; cohort: string; avatar: string; kind: 'alumni' | 'levelup' };
  pitch: string;
  status: AppStatus;
  appliedAt: string;        // relative
  lastUpdate?: string;      // relative
  attachment?: { type: 'pdf' | 'link'; label: string };
};

const APPLICATIONS: Application[] = [
  {
    id: 'a1',
    gig: { title: 'Editor for the Cohort 05 graduation reel', budget: '₹50k flat', location: 'Mumbai / Remote', mode: 'hybrid' },
    to: { name: 'LevelUp Learning', cohort: 'Official', avatar: '', kind: 'levelup' },
    pitch: 'Cut two grad reels for IIM-A and the AltUni cohort 02 — happy to share both. Premiere primary, Resolve for colour.',
    status: 'shortlisted',
    appliedAt: '2d ago',
    lastUpdate: '3h ago',
    attachment: { type: 'pdf', label: 'reel-treatment.pdf' },
  },
  {
    id: 'a2',
    gig: { title: 'DOP for 3-day documentary shoot in Kerala', budget: '₹45–60k', location: 'Kerala', mode: 'onsite' },
    to: { name: 'Aanya Mehra', cohort: 'Cohort 04', avatar: portrait('aanya-mehra'), kind: 'alumni' },
    pitch: 'I shot a 4-day doc on Channapatna toy-makers in March — same kit (FX6), similar vibe. Available the dates you mentioned.',
    status: 'replied',
    appliedAt: '5d ago',
    lastUpdate: '2d ago',
    attachment: { type: 'link', label: 'vimeo.com/myreel' },
  },
  {
    id: 'a3',
    gig: { title: 'Sound designer for short film (post)', budget: '₹35k', location: 'Mumbai / Remote', mode: 'hybrid' },
    to: { name: 'Rohan Iyer', cohort: 'Cohort 03', avatar: portrait('rohan-iyer'), kind: 'alumni' },
    pitch: 'Did the design + mix on Anant\'s grad film. Three-week turnaround is tight but doable if locked picture by next week.',
    status: 'pending',
    appliedAt: '6h ago',
  },
  {
    id: 'a4',
    gig: { title: 'Composer-in-residence — debut feature', budget: 'Profit share', location: 'Mumbai / Remote', mode: 'hybrid' },
    to: { name: 'Aanya Mehra', cohort: 'Cohort 04', avatar: portrait('aanya-mehra'), kind: 'alumni' },
    pitch: 'Heard the snippet you shared in cohort chat — I think I have a sound for this. Available for a call this week.',
    status: 'declined',
    appliedAt: '2w ago',
    lastUpdate: '1w ago',
  },
];

type Message = {
  id: string;
  with: { name: string; cohort: string; avatar: string };
  lastFrom: 'them' | 'me';
  lastMessage: string;
  lastAt: string;
  unread: number;
  thread: Array<{ from: 'them' | 'me'; text: string; at: string }>;
};

const MESSAGES: Message[] = [
  {
    id: 'm1',
    with: { name: 'Maya Krishnan', cohort: 'Cohort 04', avatar: portrait('maya-krishnan') },
    lastFrom: 'them',
    lastMessage: 'Sent you the call sheet — does Thursday work for the recce?',
    lastAt: '12m ago',
    unread: 2,
    thread: [
      { from: 'me',   text: 'Hey Maya — saw your gig post. Free this week?', at: 'Yesterday' },
      { from: 'them', text: 'Yes! Pulling shortlist together now.', at: 'Yesterday' },
      { from: 'them', text: 'Sent you the call sheet — does Thursday work for the recce?', at: '12m ago' },
    ],
  },
  {
    id: 'm2',
    with: { name: 'Vikram Joshi', cohort: 'Cohort 03', avatar: portrait('vikram-joshi') },
    lastFrom: 'me',
    lastMessage: 'Cool — sending the demo today.',
    lastAt: '1d ago',
    unread: 0,
    thread: [
      { from: 'them', text: 'Saw your card. Want to collab on a music video?', at: '3d ago' },
      { from: 'me',   text: 'For sure — let me hear the rough cut.', at: '2d ago' },
      { from: 'them', text: 'Sent. Let me know what you think.', at: '1d ago' },
      { from: 'me',   text: 'Cool — sending the demo today.', at: '1d ago' },
    ],
  },
  {
    id: 'm3',
    with: { name: 'Neha Raghavan', cohort: 'Cohort 04', avatar: portrait('neha-raghavan') },
    lastFrom: 'them',
    lastMessage: 'No worries! Maybe next quarter.',
    lastAt: '1w ago',
    unread: 0,
    thread: [
      { from: 'me',   text: 'Hi Neha — do you do brand identity for podcasts?', at: '2w ago' },
      { from: 'them', text: 'I do! Send me a brief.', at: '2w ago' },
      { from: 'me',   text: 'Actually we found someone in-house — sorry!', at: '1w ago' },
      { from: 'them', text: 'No worries! Maybe next quarter.', at: '1w ago' },
    ],
  },
];

// ---------- Page ----------
type Tab = 'applications' | 'messages';

const CommunityInbox: React.FC = () => {
  const [tab, setTab] = useState<Tab>('applications');
  const [openMsgId, setOpenMsgId] = useState<string | null>(MESSAGES[0]?.id ?? null);
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  const unreadCount = MESSAGES.reduce((s, m) => s + m.unread, 0);
  const pendingApps = APPLICATIONS.filter(a => a.status === 'pending' || a.status === 'replied' || a.status === 'shortlisted').length;

  const openMsg = useMemo(() => MESSAGES.find(m => m.id === openMsgId) ?? null, [openMsgId]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-8 px-6 lg:px-12">
          <Link to="/community-redesign" className="flex items-center">
            <img src={forgeLogo} alt="The Forge" className="h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Link to="/community-redesign" className="hover:text-foreground transition-colors">Circle</Link>
            <Link to="/community-redesign" className="hover:text-foreground transition-colors">Gigs</Link>
            <span className="text-foreground inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Inbox
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/community-redesign"
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              ← Back to Circle
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-6 lg:px-12 pt-12 pb-24">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">My Inbox</div>
            <h1 className="font-bold mt-3 text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.92] tracking-tight text-foreground">
              <span className="italic text-primary">What&apos;s</span> happening.
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
              The gigs you&apos;ve applied to and the alumni you&apos;re talking to — in one place.
            </p>
          </div>

          {/* Inbox stats */}
          <div className="flex gap-6">
            <Stat value={String(pendingApps)} label="Open applications" />
            <Stat value={String(unreadCount)} label="Unread" accent />
          </div>
        </header>

        {/* Tabs */}
        <div className="mt-10 flex items-end justify-between border-b border-border/40">
          <ul className="flex gap-8">
            <TabBtn active={tab === 'applications'} onClick={() => setTab('applications')} icon={<Briefcase className="h-4 w-4" />}>
              Applications
              <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">{APPLICATIONS.length}</span>
            </TabBtn>
            <TabBtn active={tab === 'messages'} onClick={() => setTab('messages')} icon={<MessageCircle className="h-4 w-4" />}>
              Messages
              {unreadCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground tabular-nums">
                  {unreadCount}
                </span>
              )}
            </TabBtn>
          </ul>
        </div>

        {/* Body */}
        <div className="mt-8">
          {tab === 'applications' ? (
            <ApplicationsList
              items={APPLICATIONS}
              openId={openAppId}
              onToggle={(id) => setOpenAppId(openAppId === id ? null : id)}
            />
          ) : (
            <MessagesPane
              messages={MESSAGES}
              openId={openMsgId}
              setOpenId={setOpenMsgId}
              openMsg={openMsg}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// ---------- Applications list ----------
const ApplicationsList: React.FC<{
  items: Application[];
  openId: string | null;
  onToggle: (id: string) => void;
}> = ({ items, openId, onToggle }) => (
  <ul className="rounded-2xl border border-border/40 bg-card/30 divide-y divide-border/40 overflow-hidden">
    {items.map(a => {
      const open = openId === a.id;
      return (
        <li key={a.id}>
          <button
            type="button"
            onClick={() => onToggle(a.id)}
            className="grid w-full grid-cols-12 gap-4 p-5 text-left transition-colors hover:bg-card/50"
          >
            <div className="col-span-12 sm:col-span-6 min-w-0">
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                <span className="text-[11px] text-muted-foreground">Applied {a.appliedAt}</span>
                {a.lastUpdate && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[11px] text-muted-foreground">Updated {a.lastUpdate}</span>
                  </>
                )}
              </div>
              <h3 className="font-bold mt-2 text-base sm:text-lg text-foreground leading-snug">{a.gig.title}</h3>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ToCell to={a.to} />
              </div>
            </div>

            <div className="col-span-6 sm:col-span-2 sm:text-right">
              <div className="text-base text-foreground tabular-nums">{a.gig.budget}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{a.gig.location}</div>
            </div>

            <div className="col-span-6 sm:col-span-3 sm:text-right text-[11px] text-muted-foreground self-center">
              {a.attachment && (
                <span className="inline-flex items-center gap-1.5">
                  {a.attachment.type === 'pdf' ? (
                    <span className="inline-flex h-5 px-1.5 items-center rounded border border-primary/30 text-primary text-[9px] font-bold tracking-wide">PDF</span>
                  ) : (
                    <span className="inline-flex h-5 px-1.5 items-center rounded border border-border/50 text-muted-foreground text-[9px] uppercase tracking-wide">Link</span>
                  )}
                  <span className="truncate max-w-[140px]">{a.attachment.label}</span>
                </span>
              )}
            </div>

            <div className="col-span-12 sm:col-span-1 sm:flex sm:items-center sm:justify-end">
              <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                {open ? 'Close' : 'View'} <ArrowUpRight className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')} />
              </span>
            </div>
          </button>

          {/* Expanded */}
          {open && (
            <div className="bg-background/40 border-t border-border/30 p-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Your pitch</div>
                  <p className="mt-2 text-sm text-foreground leading-relaxed">{a.pitch}</p>

                  {a.attachment && (
                    <div className="mt-5">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Attached</div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-3 py-1.5 text-xs text-foreground">
                        {a.attachment.type === 'pdf' ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-primary/40 bg-primary/10 text-primary text-[8px] font-bold">PDF</span>
                        ) : (
                          <ArrowUpRight className="h-3 w-3 text-primary" />
                        )}
                        {a.attachment.label}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <div className="rounded-2xl border border-border/40 bg-card/40 p-4 space-y-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</div>
                    <StatusBadge status={a.status} />
                    {a.status === 'shortlisted' && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        You&apos;re on the shortlist. Reply to follow-up questions in your Messages tab.
                      </p>
                    )}
                    {a.status === 'pending' && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Most posters reply within 48 hours.
                      </p>
                    )}
                    {a.status === 'replied' && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Conversation is live — head to Messages to continue.
                      </p>
                    )}
                    {a.status === 'declined' && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Not this one — your pitch is saved if a similar gig comes up.
                      </p>
                    )}
                    <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                      Open conversation <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

const ToCell: React.FC<{ to: Application['to'] }> = ({ to }) => {
  if (to.kind === 'levelup') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary text-[8px] font-bold">LU</span>
        <span className="text-muted-foreground">To</span>
        <span className="text-foreground">{to.name}</span>
        <span className="text-primary text-[9px] uppercase tracking-[0.16em] ml-1">Official</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <Avatar className="h-5 w-5 ring-1 ring-border/50">
        <AvatarImage src={to.avatar} />
        <AvatarFallback className="bg-primary/15 text-primary text-[8px]">{to.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground">To</span>
      <span className="text-foreground">{to.name}</span>
      <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center gap-1">
        <Star className="h-2.5 w-2.5 text-primary" /> {to.cohort}
      </span>
    </span>
  );
};

// ---------- Messages pane ----------
const MessagesPane: React.FC<{
  messages: Message[];
  openId: string | null;
  setOpenId: (id: string) => void;
  openMsg: Message | null;
}> = ({ messages, openId, setOpenId, openMsg }) => (
  <div className="grid grid-cols-12 gap-4 rounded-2xl border border-border/40 bg-card/30 overflow-hidden min-h-[480px]">
    {/* Left: list */}
    <ul className="col-span-12 md:col-span-4 lg:col-span-3 divide-y divide-border/40 md:border-r md:border-border/40">
      {messages.map(m => {
        const active = openId === m.id;
        return (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setOpenId(m.id)}
              className={cn(
                'flex w-full items-start gap-3 p-4 text-left transition-colors',
                active ? 'bg-primary/[0.05] border-l-2 border-primary' : 'hover:bg-card/50 border-l-2 border-transparent'
              )}
            >
              <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/40">
                <AvatarImage src={m.with.avatar} />
                <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{m.with.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('text-sm truncate', active ? 'text-foreground' : 'text-foreground/90')}>
                    {m.with.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{m.lastAt}</span>
                </div>
                <p className={cn(
                  'mt-0.5 text-xs truncate',
                  m.unread ? 'text-foreground/90' : 'text-muted-foreground'
                )}>
                  {m.lastFrom === 'me' && <span className="text-muted-foreground/70">You: </span>}
                  {m.lastMessage}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{m.with.cohort}</span>
                  {m.unread > 0 && (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground tabular-nums">
                      {m.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>

    {/* Right: thread */}
    <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
      {openMsg ? (
        <>
          <header className="flex items-center gap-3 border-b border-border/40 px-5 py-4">
            <Avatar className="h-10 w-10 ring-1 ring-border/40">
              <AvatarImage src={openMsg.with.avatar} />
              <AvatarFallback className="bg-primary/15 text-primary text-xs">{openMsg.with.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-foreground">{openMsg.with.name}</div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center gap-1">
                <Star className="h-2.5 w-2.5 text-primary" /> Alumni · {openMsg.with.cohort}
              </div>
            </div>
            <button className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
              View profile
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {openMsg.thread.map((t, i) => (
              <div key={i} className={cn('flex', t.from === 'me' ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[78%]">
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm leading-snug',
                      t.from === 'me'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border/40 text-foreground rounded-bl-md'
                    )}
                  >
                    {t.text}
                  </div>
                  <div className={cn('mt-1 text-[10px] text-muted-foreground', t.from === 'me' && 'text-right')}>
                    {t.at}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="border-t border-border/40 p-4">
            <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 pl-4 pr-1.5 py-1.5">
              <input
                type="text"
                placeholder={`Message ${openMsg.with.name.split(' ')[0]}…`}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center px-6">
          <div>
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-foreground">No conversation selected</p>
            <p className="mt-1 text-xs text-muted-foreground">Pick one from the left.</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ---------- Bits ----------
const Stat: React.FC<{ value: string; label: string; accent?: boolean }> = ({ value, label, accent }) => (
  <div className="text-right">
    <div className={cn('text-3xl tabular-nums', accent ? 'text-primary' : 'text-foreground')}>{value}</div>
    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
  </div>
);

const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <span className={cn(active ? 'text-primary' : 'text-muted-foreground/70')}>{icon}</span>
      {children}
      <span
        className={cn(
          'absolute -bottom-px left-0 right-0 h-[2px] transition-transform origin-left',
          active ? 'scale-x-100 bg-primary shadow-[0_0_8px_hsl(41_100%_62%/0.6)]' : 'scale-x-0'
        )}
      />
    </button>
  </li>
);

const StatusBadge: React.FC<{ status: AppStatus }> = ({ status }) => {
  const map = {
    pending:     { label: 'Pending',     style: 'border-border/50 text-muted-foreground' },
    replied:     { label: 'Replied',     style: 'border-primary/40 text-primary' },
    shortlisted: { label: 'Shortlisted', style: 'border-primary/60 bg-primary/10 text-primary' },
    declined:    { label: 'Declined',    style: 'border-border/30 text-muted-foreground/60' },
    filled:      { label: 'Filled',      style: 'border-border/30 text-muted-foreground/60' },
  } as const;
  const it = map[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] rounded-full', it.style)}>
      <Circle className="h-1.5 w-1.5 fill-current" /> {it.label}
    </span>
  );
};

export default CommunityInbox;
