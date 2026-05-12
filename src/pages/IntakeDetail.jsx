import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, Copy, Save, Trash2, CheckCircle, AlertTriangle,
  Target, MessageSquare, Lightbulb, ListChecks, FileText, Zap,
  Loader2, Mail, Building2, Globe, User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PriorityBadge from '@/components/intake/PriorityBadge';
import StatusBadge from '@/components/intake/StatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statuses = ['New', 'Reviewed', 'Needs Follow-Up', 'Responded', 'Waiting on Customer', 'Closed', 'Archived'];
const priorities = ['High', 'Medium', 'Low'];
const categories = ['Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question', 'Spam or Low Value', 'Other'];

function Section({ icon: Icon, title, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 rounded-md bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

export default function IntakeDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const intakeId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: intake, isLoading } = useQuery({
    queryKey: ['intake', intakeId],
    queryFn: () => base44.entities.IntakeRecord.filter({ id: intakeId }).then(r => r[0]),
  });

  const [edits, setEdits] = useState({});
  const merged = intake ? { ...intake, ...edits } : null;

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.IntakeRecord.update(intakeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake', intakeId] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      setEdits({});
      toast.success('Intake updated');
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

  const copyDraft = () => {
    navigator.clipboard.writeText(merged?.suggested_response_draft || '');
    toast.success('Draft copied');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Intake not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/history')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to History
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/history')}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back to History
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {intake.contact_name || intake.company_name || 'Intake Record'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created {format(new Date(intake.created_date), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={merged.priority_level} />
          <StatusBadge status={merged.status} />
        </div>
      </div>

      {/* Edit Controls */}
      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select value={merged.status || 'New'} onValueChange={v => setEdits(p => ({ ...p, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Priority</Label>
            <Select value={merged.priority_level || 'Medium'} onValueChange={v => setEdits(p => ({ ...p, priority_level: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Category</Label>
            <Select value={merged.request_category || ''} onValueChange={v => setEdits(p => ({ ...p, request_category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {intake.contact_name && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{intake.contact_name}</span>
            </div>
          )}
          {intake.contact_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{intake.contact_email}</span>
            </div>
          )}
          {intake.company_name && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{intake.company_name}</span>
            </div>
          )}
          {intake.source && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{intake.source}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Original Message */}
      <Section icon={FileText} title="Original Request">
        <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
          {intake.raw_request_message}
        </div>
        {intake.optional_notes && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Notes:</p>
            <p className="text-sm">{intake.optional_notes}</p>
          </div>
        )}
      </Section>

      {/* AI Analysis */}
      <Section icon={FileText} title="Request Summary">
        <p className="text-sm leading-relaxed">{intake.request_summary}</p>
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section icon={AlertTriangle} title="Priority & Urgency">
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={intake.priority_level} />
            <Badge variant="outline">{intake.urgency_level}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{intake.priority_reason}</p>
        </Section>
        <Section icon={Target} title="Recommended Next Step">
          <p className="text-sm font-medium">{intake.recommended_next_step}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">Sentiment: {intake.sentiment}</Badge>
            <Badge variant="outline">Opportunity: {intake.business_opportunity_level}</Badge>
          </div>
        </Section>
      </div>

      {intake.key_details_detected?.length > 0 && (
        <Section icon={Zap} title="Key Details">
          <ul className="space-y-1.5">
            {intake.key_details_detected.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {intake.missing_information?.length > 0 && (
        <Section icon={Lightbulb} title="Missing Information">
          <ul className="space-y-1.5">
            {intake.missing_information.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /><span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Draft Response */}
      <Section icon={MessageSquare} title="Suggested Response Draft">
        <Textarea
          className="min-h-[120px] text-sm"
          value={merged.suggested_response_draft || ''}
          onChange={e => setEdits(p => ({ ...p, suggested_response_draft: e.target.value }))}
        />
        <Button variant="outline" size="sm" className="mt-3" onClick={copyDraft}>
          <Copy className="h-3.5 w-3.5 mr-2" />Copy Draft
        </Button>
      </Section>

      {intake.internal_notes && (
        <Section icon={FileText} title="Internal Notes">
          <p className="text-sm text-muted-foreground leading-relaxed">{intake.internal_notes}</p>
        </Section>
      )}

      {intake.follow_up_checklist?.length > 0 && (
        <Section icon={ListChecks} title="Follow-Up Checklist">
          <ul className="space-y-2">
            {intake.follow_up_checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <div className="h-5 w-5 rounded border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        <Button
          onClick={() => updateMutation.mutate(edits)}
          disabled={Object.keys(edits).length === 0 || updateMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={copyDraft}>
          <Copy className="h-4 w-4 mr-2" />Copy Response
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />Delete Intake
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
    </div>
  );
}