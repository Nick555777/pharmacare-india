import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";

import Prescriptions from "@/pages/Prescriptions";
import Inventory from "@/pages/Inventory";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import SystemGuide from "@/pages/SystemGuide";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("pharma_auth");
    setIsAuthenticated(auth === "true");
  }, []);

  if (isAuthenticated === null) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  const [authVersion, setAuthVersion] = useState(0);
  const handleLogin = () => setAuthVersion(v => v + 1);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/*" element={
                <ProtectedRoute key={authVersion}>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/patients" element={<Patients />} />

                      <Route path="/prescriptions" element={<Prescriptions />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/guide" element={<SystemGuide />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
