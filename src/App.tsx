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
import { handleQueryError, getRetryConfig } from "@/lib/queryErrorHandler";
import Index from "./pages/Index";
import HotdogDetail from "./pages/HotdogDetail";
import BrowseHotdogs from "./pages/BrowseHotdogs";
import Pantry from "./pages/Pantry";
import Passport from "./pages/Passport";
import Leaderboard from "./pages/Leaderboard";
import AccountSettings from "./pages/AccountSettings";
import Auth from "./pages/Auth";
import PopulateMetadata from "./pages/PopulateMetadata";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...getRetryConfig(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

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
              </BrowserRouter>
            </TooltipProvider>
          </UserProgressProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
