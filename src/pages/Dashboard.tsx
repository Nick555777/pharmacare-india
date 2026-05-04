import { Users, CalendarDays, Pill, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const { patients, prescriptions, medicines, invoices, clinicName } = useData();
  const pendingRx = prescriptions.filter((p) => p.status === "pending").length;
  const lowStock = medicines.filter((m) => m.stock < 20);
  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome to {clinicName}</h1>
        <p className="text-muted-foreground text-sm mt-1">Hello SRI, here's today's clinic overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patients.length} icon={Users} variant="primary" />
        <StatCard title="Inventory Items" value={medicines.length} icon={CalendarDays} variant="default" />
        <StatCard title="Pending Prescriptions" value={pendingRx} icon={Pill} variant="warning" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" /> Recent Activity
          </h2>
          <p className="text-sm text-muted-foreground">Monitor system updates and prescription status in real-time.</p>
          <div className="mt-4 space-y-4">
             <div className="p-4 bg-muted/20 rounded-xl border border-dashed text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">New billing search enabled</p>
                <p className="text-[10px] text-muted-foreground italic">Try the updated invoice generator</p>
             </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Low Stock Alerts
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">All items sufficiently stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.category}</p>
                  </div>
                  <p className="text-sm font-bold text-warning">{m.stock} left</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
