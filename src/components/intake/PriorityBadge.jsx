import { Badge } from '@/components/ui/badge';

export default function PriorityBadge({ priority }) {
  const styles = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <Badge variant="outline" className={`font-medium ${styles[priority] || 'bg-muted text-muted-foreground'}`}>
      {priority}
    </Badge>
  );
}