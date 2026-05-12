import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Inbox, Plus, AlertTriangle, Bell, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import PriorityBadge from '@/components/intake/PriorityBadge';
import StatusBadge from '@/components/intake/StatusBadge';
import { format, isToday, isThisWeek } from 'date-fns';

function StatCard({ title, value, icon: Icon, color, sub }) {
  const colorMap = {
    blue: { bg: 'bg-primary/10', text: 'text-primary' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    purple: { bg: 'bg-violet-50', text: 'text-violet-600' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <Card className="p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </Card>
  );
}

function PriorityBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barColor = { High: 'bg-red-400', Medium: 'bg-amber-400', Low: 'bg-emerald-400' }[label] || 'bg-primary';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{count} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

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

  const thisWeek = intakes.filter(i => i.created_date && isThisWeek(new Date(i.created_date))).length;

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
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const recentIntakes = intakes.slice(0, 6);
  const actionNeeded = intakes.filter(i => i.status === 'New' || i.status === 'Needs Follow-Up').slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-[3px] border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {thisWeek > 0 ? `${thisWeek} intake${thisWeek !== 1 ? 's' : ''} this week` : 'Intake activity overview'}
          </p>
        </div>
        <Link to="/intake/new">
          <Button size="sm" className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" />New Intake
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard title="Total" value={stats.total} icon={Inbox} color="blue" />
        <StatCard title="New" value={stats.newCount} icon={Clock} color="blue" sub="Awaiting review" />
        <StatCard title="High Priority" value={stats.highPriority} icon={AlertTriangle} color="red" />
        <StatCard title="Follow-Up" value={stats.needsFollowUp} icon={Bell} color="amber" />
        <StatCard title="Completed" value={stats.closed} icon={CheckCircle} color="green" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Action Needed */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-foreground">Needs Attention</h2>
              <p className="text-xs text-muted-foreground mt-0.5">New + needs follow-up</p>
            </div>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          {actionNeeded.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle className="h-9 w-9 mx-auto text-emerald-400 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-1">No intakes need attention right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {actionNeeded.map(intake => (
                <Link
                  key={intake.id}
                  to={`/intake/${intake.id}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground truncate">
                        {intake.contact_name || intake.company_name || 'Unnamed Request'}
                      </p>
                      {intake.company_name && intake.contact_name && (
                        <span className="text-xs text-muted-foreground hidden sm:block">· {intake.company_name}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate leading-relaxed">
                      {intake.recommended_next_step || intake.request_summary?.slice(0, 80) || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <PriorityBadge priority={intake.priority_level} />
                    <StatusBadge status={intake.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Priority breakdown */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-foreground">Priority</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3.5">
              {Object.entries(priorityCounts).map(([level, count]) => (
                <PriorityBar key={level} label={level} count={count} total={stats.total} />
              ))}
            </div>
          </Card>

          {/* Categories */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm text-foreground mb-4">Top Categories</h3>
            {topCategories.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-2">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate pr-2 flex-1">{cat}</span>
                    <span className="text-xs font-semibold text-foreground shrink-0 tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Recent intakes table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent Intakes</h2>
          <Link to="/history">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              Full history <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
        {recentIntakes.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="h-9 w-9 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No intakes yet.</p>
            <Link to="/intake/new">
              <Button size="sm" className="mt-4">Submit your first intake</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentIntakes.map(intake => (
              <Link
                key={intake.id}
                to={`/intake/${intake.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {intake.contact_name || intake.company_name || 'Unnamed Request'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {intake.request_summary?.slice(0, 90) || intake.raw_request_message?.slice(0, 90)}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <PriorityBadge priority={intake.priority_level} />
                  <StatusBadge status={intake.status} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
                  {intake.created_date ? format(new Date(intake.created_date), 'MMM d') : ''}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}