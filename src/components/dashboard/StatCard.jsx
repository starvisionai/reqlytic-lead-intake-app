import { Card } from '@/components/ui/card';

export default function StatCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-violet-50 text-violet-600',
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${colorMap[color] || colorMap.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}