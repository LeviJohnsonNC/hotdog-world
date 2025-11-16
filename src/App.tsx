import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import HotdogDetail from "./pages/HotdogDetail";
import BrowseHotdogs from "./pages/BrowseHotdogs";
import Passport from "./pages/Passport";
import Leaderboard from "./pages/Leaderboard";
import AccountSettings from "./pages/AccountSettings";
import Auth from "./pages/Auth";
import PopulateMetadata from "./pages/PopulateMetadata";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hotdog/:slug" element={<HotdogDetail />} />
              <Route path="/hotdogs" element={<BrowseHotdogs />} />
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
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
