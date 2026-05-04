import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { className: string }> = {
  completed: { className: "bg-success/10 text-success border-success/20 hover:bg-success/10" },
  scheduled: { className: "bg-info/10 text-info border-info/20 hover:bg-info/10" },
  cancelled: { className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10" },
  paid: { className: "bg-success/10 text-success border-success/20 hover:bg-success/10" },
  pending: { className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/10" },
  overdue: { className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10" },
  dispensed: { className: "bg-success/10 text-success border-success/20 hover:bg-success/10" },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusMap[status] || statusMap.pending;
  return (
    <Badge variant="outline" className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
