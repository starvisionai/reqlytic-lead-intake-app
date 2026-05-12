import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Inbox, Plus, AlertTriangle, Bell, CheckCircle, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PriorityBadge from '@/components/intake/PriorityBadge';
import StatusBadge from '@/components/intake/StatusBadge';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: intakes = [], isLoading } = useQuery({
    queryKey: ['intakes'],
    queryFn: () => base44.entities.IntakeRecord.list('-created_date', 100),
  });

  const stats = {
    total: intakes.length,
    newCount: intakes.filter(i => i.status === 'New').length,
    highPriority: intakes.filter(i => i.priority_level === 'High').length,
    needsFollowUp: intakes.filter(i => i.status === 'Needs Follow-Up').length,
    closed: intakes.filter(i => i.status === 'Closed' || i.status === 'Archived').length,
  };

  const priorityCounts = {
    High: intakes.filter(i => i.priority_level === 'High').length,
    Medium: intakes.filter(i => i.priority_level === 'Medium').length,
    Low: intakes.filter(i => i.priority_level === 'Low').length,
  };

  const categoryCounts = {};
  intakes.forEach(i => {
    if (i.request_category) {
      categoryCounts[i.request_category] = (categoryCounts[i.request_category] || 0) + 1;
    }
  });

  const recentIntakes = intakes.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your intake activity</p>
        </div>
        <Link to="/intake/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Intake</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Intakes" value={stats.total} icon={Inbox} color="blue" />
        <StatCard title="New" value={stats.newCount} icon={Clock} color="blue" />
        <StatCard title="High Priority" value={stats.highPriority} icon={AlertTriangle} color="red" />
        <StatCard title="Needs Follow-Up" value={stats.needsFollowUp} icon={Bell} color="amber" />
        <StatCard title="Completed" value={stats.closed} icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">Recent Intakes</h2>
          </div>
          {recentIntakes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No intakes yet. Submit your first request.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentIntakes.map(intake => (
                <Link
                  key={intake.id}
                  to={`/intake/${intake.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {intake.contact_name || intake.company_name || 'Unnamed Request'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {intake.request_summary || intake.raw_request_message?.slice(0, 80)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <PriorityBadge priority={intake.priority_level} />
                    <StatusBadge status={intake.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Priority Breakdown */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4">Priority Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(priorityCounts).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <PriorityBadge priority={level} />
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4">Categories</h3>
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(categoryCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{cat}</span>
                      <span className="font-medium ml-2">{count}</span>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}