
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Recommendations from "./pages/Recommendations";
import Contributions from "./pages/Contributions";
import SavedIssues from "./pages/SavedIssues";
import SkillsGrowth from "./pages/SkillsGrowth";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoading from "./components/PageLoading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/recommendations" element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } />
                  <Route path="/contributions" element={
                    <ProtectedRoute>
                      <Contributions />
                    </ProtectedRoute>
                  } />
                  <Route path="/saved" element={
                    <ProtectedRoute>
                      <SavedIssues />
                    </ProtectedRoute>
                  } />
                  <Route path="/skills" element={
                    <ProtectedRoute>
                      <SkillsGrowth />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  {/* Redirect /index to /dashboard */}
                  <Route path="/index" element={<Navigate to="/dashboard" replace />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
