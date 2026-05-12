import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Loader2, Inbox } from 'lucide-react';
import PriorityBadge from '@/components/intake/PriorityBadge';
import StatusBadge from '@/components/intake/StatusBadge';
import { format } from 'date-fns';

const statuses = ['All', 'New', 'Reviewed', 'Needs Follow-Up', 'Responded', 'Waiting on Customer', 'Closed', 'Archived'];
const priorities = ['All', 'High', 'Medium', 'Low'];
const categories = ['All', 'Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question', 'Spam or Low Value', 'Other'];
const sources = ['All', 'Contact Form', 'Email', 'Phone Call Notes', 'Referral', 'Social Media', 'Internal Request', 'Other'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Highest Priority' },
];

export default function IntakeHistory() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [sort, setSort] = useState('newest');

  const { data: intakes = [], isLoading } = useQuery({
    queryKey: ['intakes'],
    queryFn: () => base44.entities.IntakeRecord.list('-created_date', 500),
  });

  const filtered = useMemo(() => {
    let result = intakes;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        (i.contact_name || '').toLowerCase().includes(q) ||
        (i.company_name || '').toLowerCase().includes(q) ||
        (i.raw_request_message || '').toLowerCase().includes(q) ||
        (i.request_summary || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'All') result = result.filter(i => i.status === filterStatus);
    if (filterPriority !== 'All') result = result.filter(i => i.priority_level === filterPriority);
    if (filterCategory !== 'All') result = result.filter(i => i.request_category === filterCategory);
    if (filterSource !== 'All') result = result.filter(i => i.source === filterSource);

    result = [...result].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.created_date) - new Date(b.created_date);
      if (sort === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority_level] ?? 3) - (order[b.priority_level] ?? 3);
      }
      return new Date(b.created_date) - new Date(a.created_date);
    });

    return result;
  }, [intakes, search, filterStatus, filterPriority, filterCategory, filterSource, sort]);

  const exportCSV = () => {
    const headers = ['Date', 'Contact', 'Company', 'Category', 'Priority', 'Status', 'Source', 'Next Step', 'Summary'];
    const rows = filtered.map(i => [
      i.created_date ? format(new Date(i.created_date), 'yyyy-MM-dd') : '',
      i.contact_name || '', i.company_name || '', i.request_category || '',
      i.priority_level || '', i.status || '', i.source || '',
      i.recommended_next_step || '', (i.request_summary || '').replace(/"/g, '""'),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intakeiq-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Intake History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5 mr-1.5" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search name, company, or message…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{sortOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No intake records found.</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b border-border">
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Contact</TableHead>
                  <TableHead className="text-xs font-semibold hidden md:table-cell">Company</TableHead>
                  <TableHead className="text-xs font-semibold hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-xs font-semibold">Priority</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold hidden lg:table-cell">Source</TableHead>
                  <TableHead className="text-xs font-semibold hidden xl:table-cell">Next Step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(intake => (
                  <TableRow key={intake.id} className="cursor-pointer hover:bg-muted/40 transition-colors">
                    <TableCell className="py-3">
                      <Link to={`/intake/${intake.id}`} className="block">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {intake.created_date ? format(new Date(intake.created_date), 'MMM d, yyyy') : '—'}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <Link to={`/intake/${intake.id}`} className="block">
                        <p className="font-medium text-sm text-foreground">{intake.contact_name || '—'}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3">
                      <Link to={`/intake/${intake.id}`} className="block text-sm text-muted-foreground">
                        {intake.company_name || '—'}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-3">
                      <Link to={`/intake/${intake.id}`} className="block">
                        <span className="text-xs text-muted-foreground">{intake.request_category || '—'}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <Link to={`/intake/${intake.id}`} className="block">
                        <PriorityBadge priority={intake.priority_level} />
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <Link to={`/intake/${intake.id}`} className="block">
                        <StatusBadge status={intake.status} />
                      </Link>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-3">
                      <Link to={`/intake/${intake.id}`} className="block text-xs text-muted-foreground">
                        {intake.source || '—'}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell py-3">
                      <Link to={`/intake/${intake.id}`} className="block text-xs text-muted-foreground truncate max-w-[200px]">
                        {intake.recommended_next_step || '—'}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}