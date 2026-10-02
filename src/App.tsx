import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import BrandGuide from "./pages/BrandGuide";
import Privacy from "./pages/Privacy";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const RETIRED_PATHS = ["/ai-roi-sprint", "/services", "/roi-calculator", "/30-day-outcome-pilot", "/about"];

const App = () => (
  <HelmetProvider>
    {/* Light only: no dark theme has been designed for the redesign. */}
    <ThemeProvider attribute="class" forcedTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/brand-guide" element={<BrandGuide />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              {/* Old-offer pages: keep inbound links useful by sending them to the new Home. */}
              {RETIRED_PATHS.map((path) => (
                <Route key={path} path={path} element={<Navigate to="/" replace />} />
              ))}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <ChatWidget /> */}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
