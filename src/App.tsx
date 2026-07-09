import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { getRetryConfig } from "@/lib/queryErrorHandler";
import Index from "./pages/Index";

// Route-level code splitting: every page except the landing globe is lazy-loaded
// so visitors only download the code for the page they're on. The globe (three.js)
// is itself lazy-loaded inside Index, keeping the entry bundle lean for SEO
// arrivals that land directly on detail pages.
const HotdogDetail = lazy(() => import("./pages/HotdogDetail"));
const BrowseHotdogs = lazy(() => import("./pages/BrowseHotdogs"));
const Pantry = lazy(() => import("./pages/Pantry"));
const Passport = lazy(() => import("./pages/Passport"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const Auth = lazy(() => import("./pages/Auth"));
const PopulateMetadata = lazy(() => import("./pages/PopulateMetadata"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...getRetryConfig(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Single H1 required on every page state, including loading (see CLAUDE.md)
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
    <div className="text-center">
      <h1 className="text-2xl font-heading text-primary mb-4">Loading…</h1>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <UserProgressProvider>
            <TooltipProvider>
              <OfflineIndicator />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/hotdog/:slug" element={<HotdogDetail />} />
                    <Route path="/hotdogs" element={<BrowseHotdogs />} />
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/passport" element={<Passport />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/settings" element={<AccountSettings />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin/populate-metadata" element={<PopulateMetadata />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </UserProgressProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
