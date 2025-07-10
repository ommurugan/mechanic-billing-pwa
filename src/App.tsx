
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAStatusBar from "./components/PWAStatusBar";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.3
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SplashScreen />
          </motion.div>
        } />
        <Route path="/auth" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Auth />
          </motion.div>
        } />
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Dashboard />
              </motion.div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/invoices" 
          element={
            <AuthGuard>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Invoices />
              </motion.div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <AuthGuard>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Customers />
              </motion.div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/services" 
          element={
            <AuthGuard>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Services />
              </motion.div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <AuthGuard>
              <motion.div
                initial="initial"
                animate="in" 
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Reports />
              </motion.div>
            </AuthGuard>
          } 
        />
        <Route path="*" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen w-full">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PWAStatusBar />
          <AnimatedRoutes />
          <PWAInstallPrompt />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
