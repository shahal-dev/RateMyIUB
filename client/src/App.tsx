import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Professor from "./pages/Professor";
import Course from "./pages/Course";
import Department from "./pages/Department";
import SearchResults from "./pages/SearchResults";
import WriteReview from "./pages/WriteReview";
import NotFound from "./pages/NotFound";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Publishable Key');
}

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider 
    publishableKey={clerkPubKey}
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/professor/:id" element={<Professor />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/department/:id" element={<Department />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/write-review" element={<WriteReview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
