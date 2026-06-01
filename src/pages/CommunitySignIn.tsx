import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import forgeLogo from '@/assets/forge-logo.png';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

// ---------- Mock alumni "database" ----------
type Alum = {
  phone: string;          // E.164 without +
  name: string;
  cohort: string;
  profile_complete: boolean;
};
const ALUMNI_DB: Alum[] = [
  { phone: '919876543210', name: 'Aanya Mehra',  cohort: 'Cohort 04', profile_complete: true  },
  { phone: '919876511111', name: 'Rohan Iyer',   cohort: 'Cohort 03', profile_complete: true  },
  { phone: '919876522222', name: 'Maya Krishnan',cohort: 'Cohort 04', profile_complete: false }, // first-time
  { phone: '919999999999', name: 'Test Alum',    cohort: 'Cohort 05', profile_complete: true  },
];

const COUNTRY_CODES = [
  { code: '+91', label: 'India' },
  { code: '+1',  label: 'USA' },
  { code: '+44', label: 'UK' },
  { code: '+971',label: 'UAE' },
  { code: '+65', label: 'Singapore' },
];

type Step = 'phone' | 'otp' | 'welcome' | 'first-time' | 'not-found';

const CommunitySignIn: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [cc, setCc] = useState('+91');
  const [phone, setPhone] = useState('');
  const [matchedAlum, setMatchedAlum] = useState<Alum | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Normalised phone number (digits only with country code, no +)
  const e164 = useMemo(() => (cc + phone).replace(/\D/g, ''), [cc, phone]);

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, '').length < 7) return;
    const match = ALUMNI_DB.find(a => a.phone === e164);
    if (!match) {
      setStep('not-found');
      return;
    }
    setMatchedAlum(match);
    setStep('otp');
  };

  const handleVerifyOtp = (code: string) => {
    // Mock: any 6-digit code accepted, "0000" simulates wrong code for demo
    setOtpError(null);
    if (code === '000000') {
      setOtpError('That code didn\'t match. Try again.');
      return;
    }
    if (code.length === 6) {
      // Mirror the onboarding flag so other-profile pages know whether to gate.
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'forge.profileComplete',
          matchedAlum?.profile_complete ? 'true' : 'false'
        );
      }
      if (matchedAlum?.profile_complete) {
        setStep('welcome');
      } else {
        setStep('first-time');
      }
    }
  };

  const goBack = () => {
    if (step === 'otp' || step === 'not-found') setStep('phone');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 sm:p-6 text-foreground font-sans antialiased">
      {/* Ambient amber */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(41_100%_62%/0.10),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(27_85%_48%/0.08),transparent_70%)] blur-3xl" />
      </div>

      {/* Modal */}
      <div className="relative flex h-[min(640px,calc(100dvh-2rem))] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl border border-border/40 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <header className="flex items-center justify-between gap-3 border-b border-border/40 px-6 py-4">
          <Link to="/community-redesign/landing" className="flex items-center">
            <img src={forgeLogo} alt="The Forge" className="h-6 w-auto" />
          </Link>
          {step !== 'phone' && step !== 'welcome' && step !== 'first-time' ? (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
          ) : <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Sign in</span>}
          <button
            onClick={() => navigate('/community-redesign/landing')}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-8">
          {step === 'phone' && (
            <PhoneStep
              cc={cc} setCc={setCc}
              phone={phone} setPhone={setPhone}
              onSubmit={handleSendOtp}
            />
          )}
          {step === 'otp' && matchedAlum && (
            <OtpStep
              fullPhone={`${cc} ${phone}`}
              alumName={matchedAlum.name.split(' ')[0]}
              error={otpError}
              onVerify={handleVerifyOtp}
              onResend={() => setOtpError(null)}
              onChangeNumber={() => setStep('phone')}
            />
          )}
          {step === 'welcome' && matchedAlum && (
            <WelcomeStep alum={matchedAlum} onContinue={() => navigate('/community-redesign')} />
          )}
          {step === 'first-time' && matchedAlum && (
            <FirstTimeStep alum={matchedAlum} onContinue={() => navigate('/community-redesign/onboarding?required=true')} />
          )}
          {step === 'not-found' && (
            <NotFoundStep
              tried={`${cc} ${phone}`}
              onTryAgain={() => setStep('phone')}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// ---------- 01 · Phone step ----------
const PhoneStep: React.FC<{
  cc: string; setCc: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  onSubmit: () => void;
}> = ({ cc, setCc, phone, setPhone, onSubmit }) => {
  const canSubmit = phone.replace(/\D/g, '').length >= 7;
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
        <Phone className="h-5 w-5" />
      </div>

      <h1 className="font-bold mt-6 text-[32px] sm:text-[40px] leading-[1.02] tracking-tight text-foreground">
        Welcome <span className="italic text-primary">back</span>.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Sign in with the phone number on your Forge profile. We&apos;ll send you a one-time code.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="mt-7"
      >
        <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Phone number
        </label>

        <div className="mt-3 flex gap-2">
          {/* Country code selector */}
          <CountryCodeSelect value={cc} onChange={setCc} />

          <input
            type="tel"
            inputMode="numeric"
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, '').slice(0, 14))}
            placeholder="98765 43210"
            className="flex-1 min-w-0 rounded-2xl border border-border/40 bg-card/40 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-colors"
          />
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground/70">
          Only numbers in the Forge alumni list can sign in.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all',
            canSubmit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.6)]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Send OTP <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-auto pt-8 border-t border-border/30">
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
          Not a Forge alum yet?{' '}
          <a href="#" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Apply for the next cohort →
          </a>
        </p>
      </div>
    </div>
  );
};

// ---------- 02 · OTP step ----------
const OtpStep: React.FC<{
  fullPhone: string;
  alumName: string;
  error: string | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeNumber: () => void;
}> = ({ fullPhone, alumName, error, onVerify, onResend, onChangeNumber }) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendIn, setResendIn] = useState(45);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    if (!v && val !== '') return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
    if (next.every(d => d.length === 1)) onVerify(next.join(''));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(next);
    if (next.every(d => d.length === 1)) onVerify(next.join(''));
  };

  const handleResend = () => {
    setDigits(Array(6).fill(''));
    setResendIn(45);
    onResend();
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
        <ShieldCheck className="h-5 w-5" />
      </div>

      <h1 className="font-bold mt-6 text-[32px] sm:text-[40px] leading-[1.02] tracking-tight text-foreground">
        Hey {alumName}, <span className="italic text-primary">check your phone</span>.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        We sent a 6-digit code to <span className="text-foreground">{fullPhone}</span>.
        {' '}
        <button onClick={onChangeNumber} className="text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors">
          Use a different number
        </button>
      </p>

      <div className="mt-8">
        <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          One-time code
        </label>
        <div className="mt-3 flex gap-2 sm:gap-2.5">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={cn(
                'h-12 w-full sm:h-14 rounded-2xl border bg-card/40 text-center text-xl sm:text-2xl tabular-nums text-foreground focus:outline-none transition-all',
                error
                  ? 'border-destructive/60 focus:border-destructive'
                  : d
                    ? 'border-primary/60'
                    : 'border-border/40 focus:border-primary/60'
              )}
            />
          ))}
        </div>
        {error && (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        )}
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between text-[12px] text-muted-foreground">
        <span>
          Didn&apos;t get it?{' '}
          {resendIn > 0 ? (
            <span className="text-muted-foreground/70">Resend in 0:{String(resendIn).padStart(2,'0')}</span>
          ) : (
            <button onClick={handleResend} className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
              Resend code
            </button>
          )}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
          Auto-verifies
        </span>
      </div>
    </div>
  );
};

// ---------- 03a · Welcome back (returning user) ----------
const WelcomeStep: React.FC<{ alum: Alum; onContinue: () => void }> = ({ alum, onContinue }) => {
  const navigate = useNavigate();
  return (
  <div className="flex h-full flex-col items-center text-center">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
      <Check className="h-7 w-7" />
    </div>

    <h1 className="font-bold mt-7 text-[32px] sm:text-[40px] leading-[1.02] tracking-tight text-foreground">
      You&apos;re <span className="italic text-primary">in</span>, {alum.name.split(' ')[0]}.
    </h1>
    <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
      Signed in as <span className="text-foreground">{alum.name}</span> · {alum.cohort}.
    </p>

    <div className="mt-10 flex flex-col items-center gap-3">
      <button
        onClick={onContinue}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]"
      >
        Enter the Circle <ArrowUpRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => navigate('/community-redesign/onboarding')}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border/60 bg-background/40 px-6 py-3 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition-colors"
      >
        Set up profile
      </button>
    </div>

    <p className="mt-auto pt-8 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">
      Welcome back to the Forge.
    </p>
  </div>
  );
};

// ---------- 03b · First time (new user, send to onboarding) ----------
const FirstTimeStep: React.FC<{ alum: Alum; onContinue: () => void }> = ({ alum, onContinue }) => (
  <div className="flex h-full flex-col items-center text-center">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/40">
      <Sparkles className="h-7 w-7" />
    </div>

    <h1 className="font-bold mt-7 text-[32px] sm:text-[40px] leading-[1.02] tracking-tight text-foreground">
      First time, <span className="italic text-primary">{alum.name.split(' ')[0]}</span>?
    </h1>
    <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
      You&apos;re on the list — <span className="text-foreground">{alum.cohort}</span>, verified.
      Before you can enter the Circle, set up your card so others can find you.
    </p>

    <button
      onClick={onContinue}
      className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_8px_24px_-8px_hsl(41_100%_62%/0.5)]"
    >
      Set up your profile <ArrowRight className="h-4 w-4" />
    </button>

    <p className="mt-auto pt-8 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">
      Required · Takes about two minutes
    </p>
  </div>
);

// ---------- 04 · Not found ----------
const NotFoundStep: React.FC<{ tried: string; onTryAgain: () => void }> = ({ tried, onTryAgain }) => (
  <div className="flex h-full flex-col items-center text-center">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border/40 bg-muted text-muted-foreground">
      <X className="h-7 w-7" />
    </div>

    <h1 className="font-bold mt-7 text-[32px] sm:text-[40px] leading-[1.02] tracking-tight text-foreground">
      We couldn&apos;t <span className="italic text-primary">find you</span>.
    </h1>
    <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
      <span className="text-foreground">{tried}</span> isn&apos;t on our Forge alumni list.
      The Circle is only open to verified graduates of Cohorts 01–05.
    </p>

    <div className="mt-8 w-full space-y-2">
      <button
        onClick={onTryAgain}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try a different number
      </button>
      <a
        href="mailto:hello@theforge.in?subject=I%20think%20I%E2%80%99m%20Forge%20alumni%2C%20but%E2%80%A6"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/40 px-5 py-3 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition-colors"
      >
        Get in touch with the team
      </a>
    </div>

    <p className="mt-auto pt-8 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">
      Not Forge alumni? <a href="#" className="text-foreground hover:text-primary underline underline-offset-2 transition-colors">Apply for the next cohort →</a>
    </p>
  </div>
);

// ---------- Country code dropdown (custom) ----------
const CountryCodeSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'inline-flex h-full items-center gap-1.5 rounded-2xl border bg-card/40 px-3 py-3 text-base text-foreground transition-all',
          open ? 'border-primary/60 ring-2 ring-primary/30' : 'border-border/40 hover:border-primary/40'
        )}
      >
        {value}
        <ChevronDown className={cn('h-3.5 w-3.5 opacity-70 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-44 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
          <ul className="max-h-64 overflow-y-auto py-1">
            {COUNTRY_CODES.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition-colors',
                    value === c.code ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-card hover:text-primary'
                  )}
                >
                  <span className="tabular-nums">{c.code}</span>
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommunitySignIn;
