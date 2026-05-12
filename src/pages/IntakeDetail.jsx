import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Copy, Save, Trash2, Check, AlertTriangle,
  Target, MessageSquare, Lightbulb, ListChecks, FileText, Zap,
  Loader2, Mail, Building2, Globe, User, ArrowRight
} from 'lucide-react';
import PriorityBadge from '@/components/intake/PriorityBadge';
import StatusBadge from '@/components/intake/StatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statuses = ['New', 'Reviewed', 'Needs Follow-Up', 'Responded', 'Waiting on Customer', 'Closed', 'Archived'];
const priorities = ['High', 'Medium', 'Low'];
const categories = ['Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question', 'Spam or Low Value', 'Other'];

const urgencyColor = {
  'Immediate': 'bg-red-50 text-red-700 border-red-200',
  'Soon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Normal': 'bg-blue-50 text-blue-700 border-blue-200',
  'Low Urgency': 'bg-slate-50 text-slate-600 border-slate-200',
};

function SectionHeader({ icon: Icon, title, iconBg = 'bg-primary/10', iconColor = 'text-primary' }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-md ${iconBg}`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
    </div>
  );
}

export default function IntakeDetail() {
  const { id: intakeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: intake, isLoading } = useQuery({
    queryKey: ['intake', intakeId],
    queryFn: () => base44.entities.IntakeRecord.filter({ id: intakeId }).then(r => r[0]),
  });

  const [edits, setEdits] = useState({});
  const merged = intake ? { ...intake, ...edits } : null;
  const hasEdits = Object.keys(edits).length > 0;

  const [copied, setCopied] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.IntakeRecord.update(intakeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake', intakeId] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      setEdits({});
      toast.success('Changes saved');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.IntakeRecord.delete(intakeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      navigate('/history');
      toast.success('Intake deleted');
    }
  });

  const edit = (field, value) => setEdits(p => ({ ...p, [field]: value }));

  const copyDraft = () => {
    navigator.clipboard.writeText(merged?.suggested_response_draft || '');
    setCopied(true);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Intake record not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/history')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to History
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" onClick={() => navigate('/history')}>
          <ArrowLeft className="h-4 w-4 mr-1" />History
        </Button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {intake.contact_name || intake.company_name || 'Intake Record'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {intake.company_name && intake.contact_name ? `${intake.company_name} · ` : ''}
              {intake.source ? `${intake.source} · ` : ''}
              {intake.created_date ? format(new Date(intake.created_date), 'MMM d, yyyy') : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={merged.priority_level} />
            <StatusBadge status={merged.status} />
          </div>
        </div>
      </div>

      {/* Quick actions toolbar */}
      <Card className="px-4 py-3 flex flex-wrap items-center gap-2 bg-muted/30">
        <Button
          size="sm"
          variant={copied ? 'default' : 'outline'}
          onClick={copyDraft}
          className="h-8 px-3 text-xs"
        >
          {copied ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Response</>}
        </Button>
        <Button
          size="sm"
          onClick={() => updateMutation.mutate(edits)}
          disabled={!hasEdits || updateMutation.isPending}
          className="h-8 px-3 text-xs"
        >
          <Save className="h-3 w-3 mr-1.5" />
          {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
        {hasEdits && (
          <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
        )}
        <div className="ml-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3 w-3 mr-1.5" />Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this intake?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Status / Priority / Category editors */}
      <Card className="p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Record Status</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={merged.status || 'New'} onValueChange={v => edit('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <Select value={merged.priority_level || 'Medium'} onValueChange={v => edit('priority_level', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={merged.request_category || ''} onValueChange={v => edit('request_category', v)}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Two-col layout: Contact + AI triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact */}
        <Card className="p-5">
          <SectionHeader icon={User} title="Contact" />
          <dl className="space-y-2.5">
            {[
              { icon: User, label: 'Name', val: intake.contact_name },
              { icon: Mail, label: 'Email', val: intake.contact_email },
              { icon: Building2, label: 'Company', val: intake.company_name },
              { icon: Globe, label: 'Source', val: intake.source },
            ].filter(f => f.val).map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0 text-xs">{label}</span>
                <span className="text-foreground">{val}</span>
              </div>
            ))}
          </dl>
        </Card>

        {/* AI Triage */}
        <Card className="p-5">
          <SectionHeader icon={Target} title="AI Triage" />
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Recommended Next Step</p>
              <p className="text-sm font-semibold text-foreground flex items-start gap-1.5">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                {intake.recommended_next_step}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={`text-xs ${urgencyColor[intake.urgency_level] || ''}`}>
                {intake.urgency_level}
              </Badge>
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                {intake.request_category}
              </Badge>
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                Sentiment: {intake.sentiment}
              </Badge>
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                Opportunity: {intake.business_opportunity_level}
              </Badge>
            </div>
            {intake.priority_reason && (
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2.5">{intake.priority_reason}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="p-5">
        <SectionHeader icon={FileText} title="Request Summary" />
        <p className="text-sm text-foreground leading-relaxed">{intake.request_summary}</p>
      </Card>

      {/* Original message */}
      <Card className="p-5">
        <SectionHeader icon={MessageSquare} title="Original Request" iconBg="bg-muted" iconColor="text-muted-foreground" />
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border/60">
          {intake.raw_request_message}
        </div>
        {intake.optional_notes && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Internal Notes:</p>
            <p className="text-sm text-muted-foreground">{intake.optional_notes}</p>
          </div>
        )}
      </Card>

      {/* Key Details + Missing Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {intake.key_details_detected?.length > 0 && (
          <Card className="p-5">
            <SectionHeader icon={Zap} title="Key Details" />
            <ul className="space-y-2">
              {intake.key_details_detected.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {intake.missing_information?.length > 0 && (
          <Card className="p-5">
            <SectionHeader icon={Lightbulb} title="Missing Information" iconBg="bg-amber-50" iconColor="text-amber-600" />
            <ul className="space-y-2">
              {intake.missing_information.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Draft Response — prominent with copy button */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader icon={MessageSquare} title="Response Draft" />
          <Button
            size="sm"
            variant={copied ? 'default' : 'outline'}
            onClick={copyDraft}
            className="h-7 px-3 text-xs -mt-3"
          >
            {copied ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Draft</>}
          </Button>
        </div>
        <Textarea
          className="text-sm leading-relaxed min-h-[140px] bg-muted/30 resize-none"
          value={merged.suggested_response_draft || ''}
          onChange={e => edit('suggested_response_draft', e.target.value)}
          placeholder="No response draft available."
        />
      </Card>

      {/* Internal Notes + Follow-up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {intake.internal_notes && (
          <Card className="p-5">
            <SectionHeader icon={FileText} title="Internal Notes" iconBg="bg-muted" iconColor="text-muted-foreground" />
            <p className="text-sm text-muted-foreground leading-relaxed">{intake.internal_notes}</p>
          </Card>
        )}
        {intake.follow_up_checklist?.length > 0 && (
          <Card className="p-5">
            <SectionHeader icon={ListChecks} title="Follow-Up Checklist" iconBg="bg-muted" iconColor="text-muted-foreground" />
            <ul className="space-y-2">
              {intake.follow_up_checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="h-4 w-4 rounded border border-border flex items-center justify-center shrink-0 mt-0.5 bg-background">
                    <span className="text-[9px] text-muted-foreground leading-none font-medium">{i + 1}</span>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

    </div>
  );
}