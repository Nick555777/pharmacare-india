import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarDays, Pill, Package, Receipt,
  BarChart3, BookOpen, LogOut, Activity, Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", icon: Users, label: "Patients" },

  { to: "/prescriptions", icon: Pill, label: "Prescriptions" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/billing", icon: Receipt, label: "Billing" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/guide", icon: BookOpen, label: "System Guide" },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { clinicName } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pharma_auth");
    toast({ title: "Logged out", description: "You have been securely logged out." });
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="no-print w-64 flex-shrink-0 bg-sidebar flex flex-col shadow-xl">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight truncate w-32">{clinicName}</h1>
              <p className="text-[11px] text-sidebar-foreground">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              SR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">SRI</p>
              <p className="text-[11px] text-sidebar-foreground truncate">pharmacare.india@system.com</p>
            </div>
            <LogOut 
              className="w-4 h-4 text-sidebar-foreground cursor-pointer hover:text-sidebar-accent-foreground transition-colors" 
              onClick={handleLogout}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
