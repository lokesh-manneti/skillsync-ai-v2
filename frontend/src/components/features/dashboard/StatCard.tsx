import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string; // Tailwind bg class
}

export function StatCard({ title, value, icon: Icon, trend, color = "bg-blue-500" }: StatCardProps) {
  return (
    <Card className="p-6 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </Card>
  );
}