// Complete source code content for PDF export
// Contains exact source code from all project files

// Helper to convert raw string to lines array
const toLines = (s: string): string[] => s.split('\n');

export const sourceFiles = [
  {
    title: "Type Definitions (src/types/pharmacy.ts)",
    description: "TypeScript interfaces defining the data models for all entities in the system including Patient, Appointment, Prescription, Medicine, and Invoice.",
    code: toLines(`export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  registeredAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  reason: string;
}

export interface PrescriptionMedicine {
  medicineId: string;
  name: string;
  dosage: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  medicines: PrescriptionMedicine[];
  status: "pending" | "dispensed";
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  expiryDate: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  status: "paid" | "pending" | "overdue";
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingPrescriptions: number;
  lowStockItems: number;
  monthlyRevenue: number;
  revenueChange: number;
}`),
  },
  {
    title: "Data Context Provider (src/context/DataContext.tsx)",
    description: "Centralized state management using React Context API. Provides CRUD operations for all entities with localStorage persistence for offline capability.",
    code: toLines(`import { createContext, useContext, useState,
  ReactNode, useCallback } from "react";
import { Patient, Appointment, Prescription,
  Medicine, Invoice } from "@/types/pharmacy";
import { mockPatients, mockAppointments,
  mockPrescriptions, mockMedicines,
  mockInvoices } from "@/data/mockData";

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function saveState<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

interface DataContextType {
  patients: Patient[];
  addPatient: (p: Omit<Patient, "id">) => void;
  updatePatient: (id: string, p: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, "id">) => void;
  updateAppointment: (id: string, a: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  prescriptions: Prescription[];
  addPrescription: (p: Omit<Prescription, "id">) => void;
  updatePrescription: (id: string, p: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;

  medicines: Medicine[];
  addMedicine: (m: Omit<Medicine, "id">) => void;
  updateMedicine: (id: string, m: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  invoices: Invoice[];
  addInvoice: (i: Omit<Invoice, "id">) => void;
  updateInvoice: (id: string, i: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error(
    "useData must be used within DataProvider"
  );
  return ctx;
};

let counter = Date.now();
const genId = (prefix: string) =>
  prefix + String(++counter);

export const DataProvider = (
  { children }: { children: ReactNode }
) => {
  const [patients, setPatients] = useState<Patient[]>(
    () => loadState("pc_patients", mockPatients)
  );
  const [appointments, setAppointments] =
    useState<Appointment[]>(
      () => loadState("pc_appointments", mockAppointments)
    );
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(
      () => loadState("pc_prescriptions", mockPrescriptions)
    );
  const [medicines, setMedicines] = useState<Medicine[]>(
    () => loadState("pc_medicines", mockMedicines)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(
    () => loadState("pc_invoices", mockInvoices)
  );

  const update = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: string
  ) => (fn: (prev: T) => T) =>
    setter((prev) => {
      const next = fn(prev);
      saveState(key, next);
      return next;
    });

  const up = {
    patients: update(setPatients, "pc_patients"),
    appointments: update(setAppointments, "pc_appointments"),
    prescriptions: update(setPrescriptions, "pc_prescriptions"),
    medicines: update(setMedicines, "pc_medicines"),
    invoices: update(setInvoices, "pc_invoices"),
  };

  const value: DataContextType = {
    patients,
    addPatient: useCallback((p) =>
      up.patients((prev) =>
        [...prev, { ...p, id: genId("P") }]
      ), []),
    updatePatient: useCallback((id, p) =>
      up.patients((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...p } : x))
      ), []),
    deletePatient: useCallback((id) =>
      up.patients((prev) =>
        prev.filter((x) => x.id !== id)
      ), []),

    appointments,
    addAppointment: useCallback((a) =>
      up.appointments((prev) =>
        [...prev, { ...a, id: genId("A") }]
      ), []),
    updateAppointment: useCallback((id, a) =>
      up.appointments((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...a } : x))
      ), []),
    deleteAppointment: useCallback((id) =>
      up.appointments((prev) =>
        prev.filter((x) => x.id !== id)
      ), []),

    prescriptions,
    addPrescription: useCallback((p) =>
      up.prescriptions((prev) =>
        [...prev, { ...p, id: genId("RX") }]
      ), []),
    updatePrescription: useCallback((id, p) =>
      up.prescriptions((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...p } : x))
      ), []),
    deletePrescription: useCallback((id) =>
      up.prescriptions((prev) =>
        prev.filter((x) => x.id !== id)
      ), []),

    medicines,
    addMedicine: useCallback((m) =>
      up.medicines((prev) =>
        [...prev, { ...m, id: genId("M") }]
      ), []),
    updateMedicine: useCallback((id, m) =>
      up.medicines((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...m } : x))
      ), []),
    deleteMedicine: useCallback((id) =>
      up.medicines((prev) =>
        prev.filter((x) => x.id !== id)
      ), []),

    invoices,
    addInvoice: useCallback((i) =>
      up.invoices((prev) =>
        [...prev, { ...i, id: genId("INV") }]
      ), []),
    updateInvoice: useCallback((id, i) =>
      up.invoices((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...i } : x))
      ), []),
    deleteInvoice: useCallback((id) =>
      up.invoices((prev) =>
        prev.filter((x) => x.id !== id)
      ), []),
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};`),
  },
  {
    title: "Application Entry Point (src/App.tsx)",
    description: "Root component that configures the application with React Query, tooltip provider, data context, routing, and toast notifications.",
    code: toLines(`import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider }
  from "@tanstack/react-query";
import { BrowserRouter, Routes, Route }
  from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import Appointments from "@/pages/Appointments";
import Prescriptions from "@/pages/Prescriptions";
import Inventory from "@/pages/Inventory";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import SystemGuide from "@/pages/SystemGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients"
                element={<Patients />} />
              <Route path="/appointments"
                element={<Appointments />} />
              <Route path="/prescriptions"
                element={<Prescriptions />} />
              <Route path="/inventory"
                element={<Inventory />} />
              <Route path="/billing"
                element={<Billing />} />
              <Route path="/reports"
                element={<Reports />} />
              <Route path="/guide"
                element={<SystemGuide />} />
              <Route path="*"
                element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`),
  },
  {
    title: "Application Layout (src/components/AppLayout.tsx)",
    description: "Main layout component with a sidebar navigation containing links to all modules. Highlights the active route and displays user information.",
    code: toLines(`import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarDays, Pill,
  Package, Receipt, BarChart3, BookOpen,
  LogOut, Activity
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/appointments", icon: CalendarDays,
    label: "Appointments" },
  { to: "/prescriptions", icon: Pill,
    label: "Prescriptions" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/billing", icon: Receipt, label: "Billing" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/guide", icon: BookOpen, label: "System Guide" },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="no-print w-64 flex-shrink-0
        bg-sidebar flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg
              bg-sidebar-primary flex items-center
              justify-center">
              <Activity className="w-5 h-5
                text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold
                text-sidebar-accent-foreground
                tracking-tight">
                PharmaCare
              </h1>
              <p className="text-[11px]
                text-sidebar-foreground">
                Management System
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5
          overflow-y-auto">
          {navItems.map((item) => {
            const active =
              location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={
                  active
                    ? "flex items-center gap-3 px-3
                      py-2.5 rounded-lg text-sm
                      bg-sidebar-accent
                      text-sidebar-primary font-medium"
                    : "flex items-center gap-3 px-3
                      py-2.5 rounded-lg text-sm
                      text-sidebar-foreground
                      hover:bg-sidebar-accent"
                }>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t
          border-sidebar-border">
          <div className="flex items-center gap-3
            px-3 py-2.5">
            <div className="w-8 h-8 rounded-full
              bg-sidebar-accent flex items-center
              justify-center text-xs font-medium
              text-sidebar-accent-foreground">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium
                text-sidebar-accent-foreground truncate">
                Admin User
              </p>
              <p className="text-[11px]
                text-sidebar-foreground truncate">
                admin@pharmacare.com
              </p>
            </div>
            <LogOut className="w-4 h-4
              text-sidebar-foreground cursor-pointer
              hover:text-sidebar-accent-foreground" />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;`),
  },
  {
    title: "Stat Card Component (src/components/StatCard.tsx)",
    description: "Reusable dashboard statistics card with configurable variants (default, primary, warning, success) for color-coded data display.",
    code: toLines(`import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-accent border-primary/20",
  warning: "bg-warning/5 border-warning/20",
  success: "bg-success/5 border-success/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const StatCard = ({
  title, value, change, icon: Icon,
  variant = "default"
}: StatCardProps) => (
  <div className={cn(
    "rounded-xl border p-5 animate-fade-in",
    variantStyles[variant]
  )}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        <p className="text-2xl font-bold mt-1
          text-card-foreground">
          {value}
        </p>
        {change && (
          <p className="text-xs text-success mt-1">
            {change}
          </p>
        )}
      </div>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center
        justify-center",
        iconStyles[variant]
      )}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default StatCard;`),
  },
  {
    title: "Status Badge Component (src/components/StatusBadge.tsx)",
    description: "Color-coded badge component that displays entity statuses (completed, scheduled, cancelled, paid, pending, overdue, dispensed) with appropriate styling.",
    code: toLines(`import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { className: string }> = {
  completed: {
    className: "bg-success/10 text-success
      border-success/20 hover:bg-success/10"
  },
  scheduled: {
    className: "bg-info/10 text-info
      border-info/20 hover:bg-info/10"
  },
  cancelled: {
    className: "bg-destructive/10 text-destructive
      border-destructive/20 hover:bg-destructive/10"
  },
  paid: {
    className: "bg-success/10 text-success
      border-success/20 hover:bg-success/10"
  },
  pending: {
    className: "bg-warning/10 text-warning
      border-warning/20 hover:bg-warning/10"
  },
  overdue: {
    className: "bg-destructive/10 text-destructive
      border-destructive/20 hover:bg-destructive/10"
  },
  dispensed: {
    className: "bg-success/10 text-success
      border-success/20 hover:bg-success/10"
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusMap[status] || statusMap.pending;
  return (
    <Badge variant="outline" className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;`),
  },
  {
    title: "Dashboard Page (src/pages/Dashboard.tsx)",
    description: "Main dashboard displaying key statistics (total patients, upcoming appointments, pending prescriptions, revenue), upcoming appointments table, and low-stock medicine alerts.",
    code: toLines(`import { Users, CalendarDays, Pill,
  TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";

const Dashboard = () => {
  const { patients, appointments, prescriptions,
    medicines, invoices } = useData();

  const pendingRx = prescriptions.filter(
    (p) => p.status === "pending"
  ).length;

  const lowStock = medicines.filter(
    (m) => m.stock < 20
  );

  const upcomingAppts = appointments.filter(
    (a) => a.status === "scheduled"
  ).slice(0, 5);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Admin. Here is today overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2
        lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients"
          value={patients.length}
          icon={Users} variant="primary" />
        <StatCard title="Upcoming Appointments"
          value={upcomingAppts.length}
          icon={CalendarDays} variant="default" />
        <StatCard title="Pending Prescriptions"
          value={pendingRx}
          icon={Pill} variant="warning" />
        <StatCard title="Total Revenue"
          value={"$" + totalRevenue.toLocaleString()}
          icon={TrendingUp} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2
        gap-6">
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4
            flex items-center gap-2">
            <CalendarDays className="w-4 h-4
              text-primary" />
            Upcoming Appointments
          </h2>
          {upcomingAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming appointments.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.patientName}
                    </TableCell>
                    <TableCell>
                      {a.doctorName}
                    </TableCell>
                    <TableCell>
                      {a.date} {a.time}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4
            flex items-center gap-2">
            <AlertTriangle className="w-4 h-4
              text-warning" />
            Low Stock Alerts
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All items sufficiently stocked.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((m) => (
                <div key={m.id}
                  className="flex items-center
                  justify-between p-3 rounded-lg
                  bg-warning/5 border border-warning/10">
                  <div>
                    <p className="text-sm font-medium">
                      {m.name}
                    </p>
                    <p className="text-xs
                      text-muted-foreground">
                      {m.category}
                    </p>
                  </div>
                  <p className="text-sm font-bold
                    text-warning">
                    {m.stock} left
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`),
  },
  {
    title: "Patient Management (src/pages/Patients.tsx)",
    description: "Full CRUD patient management page with search, add/edit dialog, delete confirmation, and a responsive data table displaying patient records.",
    code: toLines(`import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue }
  from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter }
  from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle }
  from "@/components/ui/alert-dialog";
import { Users, Search, Plus, Pencil, Trash2 }
  from "lucide-react";
import { useState } from "react";
import { Patient } from "@/types/pharmacy";
import { toast } from "@/hooks/use-toast";

const emptyPatient = {
  name: "", age: 0, gender: "Male",
  phone: "", email: "", address: "",
  bloodGroup: "O+",
  registeredAt: new Date()
    .toISOString().split("T")[0]
};

const Patients = () => {
  const { patients, addPatient, updatePatient,
    deletePatient } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] =
    useState<string | null>(null);
  const [editing, setEditing] =
    useState<Patient | null>(null);
  const [form, setForm] = useState(emptyPatient);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(
      search.toLowerCase()
    ) || p.id.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyPatient);
    setDialogOpen(true);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setForm({
      name: p.name, age: p.age,
      gender: p.gender, phone: p.phone,
      email: p.email, address: p.address,
      bloodGroup: p.bloodGroup,
      registeredAt: p.registeredAt
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive"
      });
      return;
    }
    if (editing) {
      updatePatient(editing.id, form);
      toast({ title: "Patient updated" });
    } else {
      addPatient(form as Omit<Patient, "id">);
      toast({ title: "Patient added" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePatient(deleteId);
      toast({ title: "Patient deleted" });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Patient Records
          </h1>
          <p className="text-muted-foreground
            text-sm mt-1">
            {patients.length} registered patients
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3
          top-1/2 -translate-y-1/2 w-4 h-4
          text-muted-foreground" />
        <Input placeholder="Search patients..."
          className="pl-9" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl border
        overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono
                  text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">
                  {p.name}
                </TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5
                    rounded bg-accent
                    text-accent-foreground text-xs
                    font-medium">
                    {p.bloodGroup}
                  </span>
                </TableCell>
                <TableCell
                  className="text-muted-foreground
                  text-sm">
                  {p.registeredAt}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost"
                      size="icon" className="h-7 w-7"
                      onClick={() => openEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteId(p.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Patient" : "Add New Patient"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Full Name *</Label>
              <Input value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" value={form.age}
                onChange={(e) =>
                  setForm({ ...form,
                    age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender}
                onValueChange={(v) =>
                  setForm({ ...form, gender: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select value={form.bloodGroup}
                onValueChange={(v) =>
                  setForm({ ...form, bloodGroup: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"]
                    .map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <Input value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Add"} Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Patient?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
              The patient record will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Patients;`),
  },
  {
    title: "Appointment Scheduling (src/pages/Appointments.tsx)",
    description: "Appointment scheduling page with patient-doctor mapping, date/time selection, status tracking (scheduled/completed/cancelled), and full CRUD operations.",
    code: toLines(`import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue }
  from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter }
  from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle }
  from "@/components/ui/alert-dialog";
import { CalendarDays, Plus, Pencil, Trash2 }
  from "lucide-react";
import { useState } from "react";
import { Appointment } from "@/types/pharmacy";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";

const emptyAppt = {
  patientId: "", patientName: "",
  doctorName: "", date: "", time: "",
  status: "scheduled" as
    "scheduled" | "completed" | "cancelled",
  reason: ""
};

const Appointments = () => {
  const { appointments, addAppointment,
    updateAppointment, deleteAppointment,
    patients } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] =
    useState<string | null>(null);
  const [editing, setEditing] =
    useState<Appointment | null>(null);
  const [form, setForm] = useState(emptyAppt);

  const openNew = () => {
    setEditing(null);
    setForm(emptyAppt);
    setDialogOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setForm({
      patientId: a.patientId,
      patientName: a.patientName,
      doctorName: a.doctorName,
      date: a.date, time: a.time,
      status: a.status, reason: a.reason
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.patientName.trim()
      || !form.doctorName.trim() || !form.date) {
      toast({
        title: "Fill required fields",
        variant: "destructive"
      });
      return;
    }
    if (editing) {
      updateAppointment(editing.id, form);
      toast({ title: "Appointment updated" });
    } else {
      addAppointment(form);
      toast({ title: "Appointment scheduled" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAppointment(deleteId);
      toast({ title: "Appointment deleted" });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            flex items-center gap-2">
            <CalendarDays
              className="w-6 h-6 text-primary" />
            Appointments
          </h1>
          <p className="text-muted-foreground
            text-sm mt-1">
            {appointments.length} total appointments
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          New Appointment
        </Button>
      </div>

      <div className="bg-card rounded-xl border
        overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono
                  text-xs">{a.id}</TableCell>
                <TableCell className="font-medium">
                  {a.patientName}
                </TableCell>
                <TableCell>{a.doctorName}</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell>{a.time}</TableCell>
                <TableCell
                  className="text-muted-foreground
                  max-w-[200px] truncate">
                  {a.reason}
                </TableCell>
                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost"
                      size="icon" className="h-7 w-7"
                      onClick={() => openEdit(a)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteId(a.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Schedule / Edit Dialog */}
      <Dialog open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Appointment"
                : "Schedule Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Patient Name *</Label>
              <Select value={form.patientName}
                onValueChange={(v) => {
                  const p = patients.find(
                    (x) => x.name === v
                  );
                  setForm({ ...form,
                    patientName: v,
                    patientId: p?.id || ""
                  });
                }}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id}
                      value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Doctor *</Label>
              <Select value={form.doctorName}
                onValueChange={(v) =>
                  setForm({ ...form, doctorName: v })}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {["Dr. Smith", "Dr. Patel",
                    "Dr. Lee", "Dr. Johnson"]
                    .map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date *</Label>
              <Input type="date" value={form.date}
                onChange={(e) =>
                  setForm({ ...form,
                    date: e.target.value })} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={form.time}
                onChange={(e) =>
                  setForm({ ...form,
                    time: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Reason</Label>
              <Input value={form.reason}
                onChange={(e) =>
                  setForm({ ...form,
                    reason: e.target.value })} />
            </div>
            {editing && (
              <div className="col-span-2">
                <Label>Status</Label>
                <Select value={form.status}
                  onValueChange={(v: "scheduled"
                    | "completed" | "cancelled") =>
                    setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">
                      Scheduled
                    </SelectItem>
                    <SelectItem value="completed">
                      Completed
                    </SelectItem>
                    <SelectItem value="cancelled">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Appointment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove
              this appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Appointments;`),
  },
  {
    title: "Prescription Management (src/pages/Prescriptions.tsx)",
    description: "Digital prescription management with medicine line-item builder, patient-doctor selection, dosage input, quantity tracking, and dispensing status workflow.",
    code: toLines(`import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue }
  from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter }
  from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle }
  from "@/components/ui/alert-dialog";
import { Pill, Plus, Pencil, Trash2 }
  from "lucide-react";
import { useState } from "react";
import { Prescription, PrescriptionMedicine }
  from "@/types/pharmacy";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";

const Prescriptions = () => {
  const { prescriptions, addPrescription,
    updatePrescription, deletePrescription,
    patients, medicines: medList } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] =
    useState<string | null>(null);
  const [editing, setEditing] =
    useState<Prescription | null>(null);
  const [form, setForm] = useState({
    patientId: "", patientName: "",
    doctorName: "", date: "",
    status: "pending" as "pending" | "dispensed",
    medicines: [] as PrescriptionMedicine[]
  });
  const [medForm, setMedForm] = useState({
    medicineId: "", name: "",
    dosage: "", quantity: 1
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      patientId: "", patientName: "",
      doctorName: "",
      date: new Date().toISOString().split("T")[0],
      status: "pending", medicines: []
    });
    setDialogOpen(true);
  };

  const openEdit = (rx: Prescription) => {
    setEditing(rx);
    setForm({
      patientId: rx.patientId,
      patientName: rx.patientName,
      doctorName: rx.doctorName,
      date: rx.date, status: rx.status,
      medicines: [...rx.medicines]
    });
    setDialogOpen(true);
  };

  const addMed = () => {
    if (!medForm.name) return;
    setForm({
      ...form,
      medicines: [...form.medicines, { ...medForm }]
    });
    setMedForm({
      medicineId: "", name: "",
      dosage: "", quantity: 1
    });
  };

  const removeMed = (i: number) =>
    setForm({
      ...form,
      medicines: form.medicines.filter(
        (_, idx) => idx !== i
      )
    });

  const handleSave = () => {
    if (!form.patientName || !form.doctorName
      || form.medicines.length === 0) {
      toast({
        title: "Fill all fields and add"
          + " at least 1 medicine",
        variant: "destructive"
      });
      return;
    }
    if (editing) {
      updatePrescription(editing.id, form);
      toast({ title: "Prescription updated" });
    } else {
      addPrescription(form);
      toast({ title: "Prescription created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePrescription(deleteId);
      toast({ title: "Prescription deleted" });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary" />
            Prescriptions
          </h1>
          <p className="text-muted-foreground
            text-sm mt-1">
            {prescriptions.length} prescriptions
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          New Prescription
        </Button>
      </div>

      <div className="bg-card rounded-xl border
        overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rx ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Medicines</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="font-mono
                  text-xs">{rx.id}</TableCell>
                <TableCell className="font-medium">
                  {rx.patientName}
                </TableCell>
                <TableCell>{rx.doctorName}</TableCell>
                <TableCell>{rx.date}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {rx.medicines.map((m, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium">
                          {m.name}
                        </span>
                        <span
                          className="text-muted-foreground">
                          {" "}- {m.dosage} (x{m.quantity})
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={rx.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost"
                      size="icon" className="h-7 w-7"
                      onClick={() => openEdit(rx)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteId(rx.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Prescription Dialog */}
      <Dialog open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh]
          overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Prescription"
                : "New Prescription"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient *</Label>
              <Select value={form.patientName}
                onValueChange={(v) => {
                  const p = patients.find(
                    (x) => x.name === v
                  );
                  setForm({ ...form,
                    patientName: v,
                    patientId: p?.id || ""
                  });
                }}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id}
                      value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Doctor *</Label>
              <Select value={form.doctorName}
                onValueChange={(v) =>
                  setForm({ ...form, doctorName: v })}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {["Dr. Smith", "Dr. Patel", "Dr. Lee"]
                    .map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date}
                onChange={(e) =>
                  setForm({ ...form,
                    date: e.target.value })} />
            </div>
            {editing && (
              <div>
                <Label>Status</Label>
                <Select value={form.status}
                  onValueChange={
                    (v: "pending" | "dispensed") =>
                    setForm({ ...form, status: v })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>
                    <SelectItem value="dispensed">
                      Dispensed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="border rounded-lg p-3
              space-y-3">
              <Label className="text-sm font-semibold">
                Medicines
              </Label>
              {form.medicines.map((m, i) => (
                <div key={i}
                  className="flex items-center gap-2
                  text-sm bg-muted rounded p-2">
                  <span className="flex-1">
                    {m.name} - {m.dosage} (x{m.quantity})
                  </span>
                  <Button variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeMed(i)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-2">
                <Select value={medForm.name}
                  onValueChange={(v) => {
                    const med = medList.find(
                      (x) => x.name === v
                    );
                    setMedForm({ ...medForm,
                      name: v,
                      medicineId: med?.id || ""
                    });
                  }}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue
                      placeholder="Medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {medList.map((m) => (
                      <SelectItem key={m.id}
                        value={m.name}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Dosage"
                  value={medForm.dosage}
                  onChange={(e) =>
                    setMedForm({ ...medForm,
                      dosage: e.target.value })} />
                <div className="flex gap-1">
                  <Input type="number"
                    placeholder="Qty"
                    value={medForm.quantity}
                    onChange={(e) =>
                      setMedForm({ ...medForm,
                        quantity: parseInt(
                          e.target.value) || 1 })}
                    className="w-16" />
                  <Button size="sm" onClick={addMed}
                    disabled={!medForm.name}>+</Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Prescription?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove
              this prescription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Prescriptions;`),
  },
  {
    title: "Inventory Management (src/pages/Inventory.tsx)",
    description: "Medicine inventory management with stock tracking, low-stock visual alerts (threshold: 20 units), pricing, supplier information, expiry date tracking, and full CRUD operations.",
    code: toLines(`import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter }
  from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle }
  from "@/components/ui/alert-dialog";
import { Package, Plus, Pencil, Trash2,
  AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Medicine } from "@/types/pharmacy";
import { toast } from "@/hooks/use-toast";

const emptyMed = {
  name: "", category: "", stock: 0,
  price: 0, supplier: "", expiryDate: ""
};

const Inventory = () => {
  const { medicines, addMedicine,
    updateMedicine, deleteMedicine } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] =
    useState<string | null>(null);
  const [editing, setEditing] =
    useState<Medicine | null>(null);
  const [form, setForm] = useState(emptyMed);

  const openNew = () => {
    setEditing(null);
    setForm(emptyMed);
    setDialogOpen(true);
  };

  const openEdit = (m: Medicine) => {
    setEditing(m);
    setForm({
      name: m.name, category: m.category,
      stock: m.stock, price: m.price,
      supplier: m.supplier,
      expiryDate: m.expiryDate
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive"
      });
      return;
    }
    if (editing) {
      updateMedicine(editing.id, form);
      toast({ title: "Medicine updated" });
    } else {
      addMedicine(form as Omit<Medicine, "id">);
      toast({ title: "Medicine added" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      toast({ title: "Medicine deleted" });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            flex items-center gap-2">
            <Package
              className="w-6 h-6 text-primary" />
            Inventory
          </h1>
          <p className="text-muted-foreground
            text-sm mt-1">
            {medicines.length} medicines in stock
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Medicine
        </Button>
      </div>

      <div className="bg-card rounded-xl border
        overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono
                  text-xs">{m.id}</TableCell>
                <TableCell className="font-medium">
                  {m.name}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5
                    rounded bg-accent
                    text-accent-foreground text-xs">
                    {m.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center
                    gap-1.5">
                    {m.stock < 20 && (
                      <AlertTriangle
                        className="w-3.5 h-3.5
                        text-warning" />
                    )}
                    <span className={m.stock < 20
                      ? "text-warning font-semibold"
                      : ""}>
                      {m.stock}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  \${m.price.toFixed(2)}
                </TableCell>
                <TableCell
                  className="text-muted-foreground">
                  {m.supplier}
                </TableCell>
                <TableCell
                  className="text-muted-foreground">
                  {m.expiryDate}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost"
                      size="icon" className="h-7 w-7"
                      onClick={() => openEdit(m)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteId(m.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Medicine Dialog */}
      <Dialog open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Medicine"
                : "Add Medicine"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name *</Label>
              <Input value={form.name}
                onChange={(e) =>
                  setForm({ ...form,
                    name: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category}
                onChange={(e) =>
                  setForm({ ...form,
                    category: e.target.value })} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form,
                    stock: parseInt(
                      e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Price ($)</Label>
              <Input type="number" step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form,
                    price: parseFloat(
                      e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Supplier</Label>
              <Input value={form.supplier}
                onChange={(e) =>
                  setForm({ ...form,
                    supplier: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Expiry Date</Label>
              <Input type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form,
                    expiryDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Medicine?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove
              this medicine from inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;`),
  },
  {
    title: "Billing & Invoices (src/pages/Billing.tsx)",
    description: "Invoice management with dynamic line-item builder, automatic total calculation, patient selection, payment status tracking (paid/pending/overdue), and revenue summary display.",
    code: toLines(`import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow }
  from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue }
  from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter }
  from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle }
  from "@/components/ui/alert-dialog";
import { Receipt, Plus, Pencil, Trash2 }
  from "lucide-react";
import { useState } from "react";
import { Invoice, InvoiceItem }
  from "@/types/pharmacy";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";

const Billing = () => {
  const { invoices, addInvoice, updateInvoice,
    deleteInvoice, patients } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] =
    useState<string | null>(null);
  const [editing, setEditing] =
    useState<Invoice | null>(null);
  const [form, setForm] = useState({
    patientId: "", patientName: "",
    date: "", items: [] as InvoiceItem[],
    total: 0,
    status: "pending" as
      "paid" | "pending" | "overdue"
  });
  const [itemForm, setItemForm] = useState({
    description: "", amount: 0
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      patientId: "", patientName: "",
      date: new Date().toISOString().split("T")[0],
      items: [], total: 0, status: "pending"
    });
    setDialogOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({
      patientId: inv.patientId,
      patientName: inv.patientName,
      date: inv.date,
      items: [...inv.items],
      total: inv.total,
      status: inv.status
    });
    setDialogOpen(true);
  };

  const addItem = () => {
    if (!itemForm.description || !itemForm.amount)
      return;
    const newItems = [
      ...form.items, { ...itemForm }
    ];
    setForm({
      ...form,
      items: newItems,
      total: newItems.reduce(
        (s, i) => s + i.amount, 0
      )
    });
    setItemForm({ description: "", amount: 0 });
  };

  const removeItem = (i: number) => {
    const newItems = form.items.filter(
      (_, idx) => idx !== i
    );
    setForm({
      ...form,
      items: newItems,
      total: newItems.reduce(
        (s, it) => s + it.amount, 0
      )
    });
  };

  const handleSave = () => {
    if (!form.patientName
      || form.items.length === 0) {
      toast({
        title: "Fill all fields and add"
          + " at least 1 item",
        variant: "destructive"
      });
      return;
    }
    if (editing) {
      updateInvoice(editing.id, form);
      toast({ title: "Invoice updated" });
    } else {
      addInvoice(form);
      toast({ title: "Invoice created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteInvoice(deleteId);
      toast({ title: "Invoice deleted" });
    }
    setDeleteId(null);
  };

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            flex items-center gap-2">
            <Receipt
              className="w-6 h-6 text-primary" />
            Billing & Invoices
          </h1>
          <p className="text-muted-foreground
            text-sm mt-1">
            <span
              className="text-success font-medium">
              \${totalRevenue.toLocaleString()} paid
            </span>
            {" "}|{" "}
            <span
              className="text-warning font-medium">
              \${totalPending.toLocaleString()} pending
            </span>
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      <div className="bg-card rounded-xl border
        overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono
                  text-xs">{inv.id}</TableCell>
                <TableCell className="font-medium">
                  {inv.patientName}
                </TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    {inv.items.map((item, i) => (
                      <div key={i}
                        className="text-xs
                        text-muted-foreground">
                        {item.description}
                        {" "}- \${item.amount.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  \${inv.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost"
                      size="icon" className="h-7 w-7"
                      onClick={() => openEdit(inv)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() =>
                        setDeleteId(inv.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Invoice Dialog */}
      <Dialog open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh]
          overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Invoice"
                : "New Invoice"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient *</Label>
              <Select value={form.patientName}
                onValueChange={(v) => {
                  const p = patients.find(
                    (x) => x.name === v
                  );
                  setForm({ ...form,
                    patientName: v,
                    patientId: p?.id || ""
                  });
                }}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id}
                      value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date}
                onChange={(e) =>
                  setForm({ ...form,
                    date: e.target.value })} />
            </div>
            {editing && (
              <div>
                <Label>Status</Label>
                <Select value={form.status}
                  onValueChange={
                    (v: "paid" | "pending"
                      | "overdue") =>
                    setForm({ ...form, status: v })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>
                    <SelectItem value="paid">
                      Paid
                    </SelectItem>
                    <SelectItem value="overdue">
                      Overdue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="border rounded-lg p-3
              space-y-3">
              <Label
                className="text-sm font-semibold">
                Line Items
              </Label>
              {form.items.map((item, i) => (
                <div key={i}
                  className="flex items-center gap-2
                  text-sm bg-muted rounded p-2">
                  <span className="flex-1">
                    {item.description}
                    {" "}- \${item.amount.toFixed(2)}
                  </span>
                  <Button variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeItem(i)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="Description"
                  className="flex-1"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm,
                      description: e.target.value })} />
                <Input type="number"
                  placeholder="Amount"
                  className="w-24" step="0.01"
                  value={itemForm.amount || ""}
                  onChange={(e) =>
                    setItemForm({ ...itemForm,
                      amount: parseFloat(
                        e.target.value) || 0 })} />
                <Button size="sm" onClick={addItem}
                  disabled={!itemForm.description
                    || !itemForm.amount}>
                  +
                </Button>
              </div>
              <p className="text-sm font-semibold
                text-right">
                Total: \${form.total.toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Create"} Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Invoice?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove
              this invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Billing;`),
  },
  {
    title: "Reports & Analytics (src/pages/Reports.tsx)",
    description: "Interactive analytics dashboard with revenue trend bar chart, status overview pie chart, and summary statistics cards using the Recharts visualization library.",
    code: toLines(`import { BarChart3, TrendingUp, Users,
  DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell } from "recharts";
import { useData } from "@/context/DataContext";

const COLORS = [
  "hsl(172, 66%, 36%)",
  "hsl(217, 91%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(142, 71%, 45%)"
];

const Reports = () => {
  const { patients, invoices, appointments }
    = useData();

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.total, 0);
  const completedAppts = appointments
    .filter((a) => a.status === "completed").length;
  const scheduledAppts = appointments
    .filter((a) => a.status === "scheduled").length;

  const revenueByMonth = [
    { month: "Jan", revenue: 32000 },
    { month: "Feb", revenue: 35000 },
    { month: "Mar", revenue: totalRevenue || 45280 },
  ];

  const categoryData = [
    { name: "Paid",
      value: invoices.filter(
        (i) => i.status === "paid"
      ).length || 1 },
    { name: "Pending",
      value: invoices.filter(
        (i) => i.status === "pending"
      ).length || 1 },
    { name: "Completed Appts",
      value: completedAppts || 1 },
    { name: "Scheduled Appts",
      value: scheduledAppts || 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold
          flex items-center gap-2">
          <BarChart3
            className="w-6 h-6 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground
          text-sm mt-1">
          Live insights from your data
        </p>
      </div>

      <div className="grid grid-cols-1
        md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue (Paid)",
            value: "$"
              + totalRevenue.toLocaleString(),
            icon: DollarSign },
          { label: "Total Patients",
            value: patients.length.toString(),
            icon: Users },
          { label: "Pending Revenue",
            value: "$"
              + totalPending.toLocaleString(),
            icon: TrendingUp },
        ].map((s) => (
          <div key={s.label}
            className="bg-card rounded-xl
            border p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg
              bg-primary/10 flex items-center
              justify-center">
              <s.icon
                className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs
                text-muted-foreground">
                {s.label}
              </p>
              <p className="text-xl font-bold">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1
        lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl
          border p-5">
          <h2 className="text-lg font-semibold mb-4">
            Revenue Trend
          </h2>
          <ResponsiveContainer
            width="100%" height={280}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month"
                tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue"
                fill="hsl(172, 66%, 36%)"
                radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl
          border p-5">
          <h2 className="text-lg font-semibold mb-4">
            Status Overview
          </h2>
          <ResponsiveContainer
            width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData}
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  name + " "
                  + (percent * 100).toFixed(0) + "%"
                }>
                {categoryData.map((_, i) => (
                  <Cell key={i}
                    fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;`),
  },
  {
    title: "Mock Data (src/data/mockData.ts)",
    description: "Sample data for development and testing. Contains pre-populated arrays for patients, appointments, medicines, prescriptions, and invoices with realistic healthcare data.",
    code: toLines(`import { Patient, Appointment, Prescription,
  Medicine, Invoice, DashboardStats }
  from "@/types/pharmacy";

export const mockPatients: Patient[] = [
  { id: "P001", name: "Sarah Johnson",
    age: 34, gender: "Female",
    phone: "555-0101", email: "sarah@email.com",
    address: "123 Oak St", bloodGroup: "A+",
    registeredAt: "2024-01-15" },
  { id: "P002", name: "Michael Chen",
    age: 45, gender: "Male",
    phone: "555-0102", email: "michael@email.com",
    address: "456 Elm Ave", bloodGroup: "O+",
    registeredAt: "2024-02-20" },
  { id: "P003", name: "Emily Davis",
    age: 28, gender: "Female",
    phone: "555-0103", email: "emily@email.com",
    address: "789 Pine Rd", bloodGroup: "B-",
    registeredAt: "2024-03-05" },
  { id: "P004", name: "James Wilson",
    age: 62, gender: "Male",
    phone: "555-0104", email: "james@email.com",
    address: "321 Maple Dr", bloodGroup: "AB+",
    registeredAt: "2024-03-10" },
  { id: "P005", name: "Maria Garcia",
    age: 51, gender: "Female",
    phone: "555-0105", email: "maria@email.com",
    address: "654 Cedar Ln", bloodGroup: "O-",
    registeredAt: "2024-03-15" },
];

export const mockAppointments: Appointment[] = [
  { id: "A001", patientId: "P001",
    patientName: "Sarah Johnson",
    doctorName: "Dr. Smith",
    date: "2024-03-20", time: "09:00",
    status: "completed",
    reason: "Regular checkup" },
  { id: "A002", patientId: "P002",
    patientName: "Michael Chen",
    doctorName: "Dr. Patel",
    date: "2024-03-20", time: "10:30",
    status: "completed",
    reason: "Blood pressure follow-up" },
  { id: "A003", patientId: "P003",
    patientName: "Emily Davis",
    doctorName: "Dr. Smith",
    date: "2024-03-21", time: "14:00",
    status: "scheduled",
    reason: "Skin rash consultation" },
  { id: "A004", patientId: "P004",
    patientName: "James Wilson",
    doctorName: "Dr. Lee",
    date: "2024-03-21", time: "11:00",
    status: "scheduled",
    reason: "Diabetes management" },
  { id: "A005", patientId: "P005",
    patientName: "Maria Garcia",
    doctorName: "Dr. Patel",
    date: "2024-03-22", time: "09:30",
    status: "scheduled",
    reason: "Joint pain" },
];

export const mockMedicines: Medicine[] = [
  { id: "M001", name: "Amoxicillin 500mg",
    category: "Antibiotic", stock: 245,
    price: 12.50, supplier: "PharmaCo",
    expiryDate: "2025-06-15" },
  { id: "M002", name: "Metformin 850mg",
    category: "Antidiabetic", stock: 180,
    price: 8.75, supplier: "MedSupply",
    expiryDate: "2025-09-20" },
  { id: "M003", name: "Lisinopril 10mg",
    category: "Antihypertensive", stock: 320,
    price: 15.00, supplier: "PharmaCo",
    expiryDate: "2025-12-01" },
  { id: "M004", name: "Ibuprofen 400mg",
    category: "NSAID", stock: 12,
    price: 6.25, supplier: "HealthDist",
    expiryDate: "2025-03-30" },
  { id: "M005", name: "Omeprazole 20mg",
    category: "Antacid", stock: 95,
    price: 11.00, supplier: "MedSupply",
    expiryDate: "2025-08-10" },
  { id: "M006", name: "Cetirizine 10mg",
    category: "Antihistamine", stock: 5,
    price: 4.50, supplier: "HealthDist",
    expiryDate: "2024-12-15" },
];

export const mockPrescriptions: Prescription[] = [
  { id: "RX001", patientId: "P001",
    patientName: "Sarah Johnson",
    doctorName: "Dr. Smith",
    date: "2024-03-20",
    medicines: [
      { medicineId: "M001",
        name: "Amoxicillin 500mg",
        dosage: "1 cap 3x daily",
        quantity: 21 }
    ],
    status: "dispensed" },
  { id: "RX002", patientId: "P002",
    patientName: "Michael Chen",
    doctorName: "Dr. Patel",
    date: "2024-03-20",
    medicines: [
      { medicineId: "M003",
        name: "Lisinopril 10mg",
        dosage: "1 tab daily",
        quantity: 30 }
    ],
    status: "dispensed" },
  { id: "RX003", patientId: "P004",
    patientName: "James Wilson",
    doctorName: "Dr. Lee",
    date: "2024-03-18",
    medicines: [
      { medicineId: "M002",
        name: "Metformin 850mg",
        dosage: "1 tab 2x daily",
        quantity: 60 },
      { medicineId: "M005",
        name: "Omeprazole 20mg",
        dosage: "1 cap before breakfast",
        quantity: 30 }
    ],
    status: "pending" },
];

export const mockInvoices: Invoice[] = [
  { id: "INV001", patientId: "P001",
    patientName: "Sarah Johnson",
    date: "2024-03-20",
    items: [
      { description: "Consultation Fee",
        amount: 75 },
      { description: "Amoxicillin 500mg x21",
        amount: 262.50 }
    ],
    total: 337.50, status: "paid" },
  { id: "INV002", patientId: "P002",
    patientName: "Michael Chen",
    date: "2024-03-20",
    items: [
      { description: "Consultation Fee",
        amount: 75 },
      { description: "Lisinopril 10mg x30",
        amount: 450 }
    ],
    total: 525, status: "paid" },
  { id: "INV003", patientId: "P004",
    patientName: "James Wilson",
    date: "2024-03-18",
    items: [
      { description: "Consultation Fee",
        amount: 100 },
      { description: "Metformin 850mg x60",
        amount: 525 },
      { description: "Omeprazole 20mg x30",
        amount: 330 }
    ],
    total: 955, status: "pending" },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 1247,
  todayAppointments: 18,
  pendingPrescriptions: 7,
  lowStockItems: 3,
  monthlyRevenue: 45280,
  revenueChange: 12.5,
};`),
  },
];
