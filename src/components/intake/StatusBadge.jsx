import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ status }) {
  const styles = {
    'New': 'bg-blue-50 text-blue-700 border-blue-200',
    'Reviewed': 'bg-slate-50 text-slate-700 border-slate-200',
    'Needs Follow-Up': 'bg-amber-50 text-amber-700 border-amber-200',
    'Responded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Waiting on Customer': 'bg-violet-50 text-violet-700 border-violet-200',
    'Closed': 'bg-gray-50 text-gray-600 border-gray-200',
    'Archived': 'bg-gray-50 text-gray-500 border-gray-200',
  };

  return (
    <Badge variant="outline" className={`font-medium ${styles[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </Badge>
  );
}