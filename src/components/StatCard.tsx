import { cn } from "@/lib/utils";
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

const StatCard = ({ title, value, change, icon: Icon, variant = "default" }: StatCardProps) => (
  <div className={cn("rounded-xl border p-5 animate-fade-in", variantStyles[variant])}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1 text-card-foreground">{value}</p>
        {change && <p className="text-xs text-success mt-1">↑ {change}</p>}
      </div>
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconStyles[variant])}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
