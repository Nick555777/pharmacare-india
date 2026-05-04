import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useData } from "@/context/DataContext";

const COLORS = ["hsl(172, 66%, 36%)", "hsl(217, 91%, 60%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)"];

const Reports = () => {
  const { patients, invoices, appointments } = useData();
  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);
  const completedAppts = appointments.filter((a) => a.status === "completed").length;
  const scheduledAppts = appointments.filter((a) => a.status === "scheduled").length;

  const getMonthlyRevenue = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastSixMonths = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      
      const monthlyTotal = invoices
        .filter(inv => {
          const invDate = new Date(inv.date);
          return inv.status === "paid" && invDate.getMonth() === d.getMonth() && invDate.getFullYear() === year;
        })
        .reduce((sum, inv) => sum + inv.total, 0);

      lastSixMonths.push({ month: `${monthLabel} ${year}`, revenue: monthlyTotal });
    }
    return lastSixMonths;
  };

  const revenueByMonth = getMonthlyRevenue();

  const categoryData = [
    { name: "Paid", value: invoices.filter((i) => i.status === "paid").length },
    { name: "Pending", value: invoices.filter((i) => i.status === "pending").length },
    { name: "Overdue", value: invoices.filter((i) => i.status === "overdue").length },
  ].filter(d => d.value > 0);

  if (categoryData.length === 0) categoryData.push({ name: "No Invoices", value: 1 });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Live insights from your data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue (Paid)", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp },
          { label: "Total Patients", value: patients.length.toString(), icon: Users },
          { label: "Pending Revenue", value: `₹${totalPending.toLocaleString()}`, icon: BarChart3 },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><s.icon className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(172, 66%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
