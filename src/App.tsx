import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CommunityLanding from './pages/CommunityLanding';
import CommunityRedesign from './pages/CommunityRedesign';
import CommunitySignIn from './pages/CommunitySignIn';
import CommunityOnboarding from './pages/CommunityOnboarding';
import CommunityPostGig from './pages/CommunityPostGig';
import CommunityInbox from './pages/CommunityInbox';
import CreativeProfile from './pages/CreativeProfile';
import AdminGigs from './pages/AdminGigs';

/**
 * The Forge — Alumni Users
 *
 * A standalone prototype of the Forge Community flow.
 * Landing → Sign in (OTP) → Onboarding → Directory → Profiles → Gigs → Inbox.
 *
 * All routes live under /community-redesign/* to match the in-product paths
 * used while these pages were prototyped inside the main Forge app. The
 * root "/" simply redirects to the public landing page.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/community-redesign/landing" replace />} />

        {/* Public */}
        <Route path="/community-redesign/landing" element={<CommunityLanding />} />
        <Route path="/community-redesign/sign-in" element={<CommunitySignIn />} />

        {/* Onboarding gate */}
        <Route path="/community-redesign/onboarding" element={<CommunityOnboarding />} />

        {/* In-app */}
        <Route path="/community-redesign" element={<CommunityRedesign />} />
        <Route path="/community-redesign/creative/:id" element={<CreativeProfile />} />
        <Route path="/community-redesign/post-gig" element={<CommunityPostGig />} />
        <Route path="/community-redesign/inbox" element={<CommunityInbox />} />

        {/* Admin */}
        <Route path="/community-redesign/admin/gigs" element={<AdminGigs />} />

        {/* Anything else falls back to landing */}
        <Route path="*" element={<Navigate to="/community-redesign/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
