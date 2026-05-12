import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Save, Copy, Flag, Plus, CheckCircle, AlertTriangle,
  Target, MessageSquare, Lightbulb, ListChecks, FileText, Zap
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { toast } from 'sonner';

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

export default function AnalysisResult({ analysis, form, onSave, onSaveFollowUp, onNew, saving }) {
  const copyDraft = () => {
    navigator.clipboard.writeText(analysis.suggested_response_draft || '');
    toast.success('Response draft copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={analysis.priority_level} />
        <Badge variant="outline">{analysis.request_category}</Badge>
        <Badge variant="outline">{analysis.urgency_level}</Badge>
        <Badge variant="outline">{analysis.sentiment}</Badge>
        <Badge variant="outline">Opportunity: {analysis.business_opportunity_level}</Badge>
      </div>

      {/* Summary */}
      <Section icon={FileText} title="Request Summary">
        <p className="text-sm text-foreground leading-relaxed">{analysis.request_summary}</p>
      </Section>

      {/* Priority & Next Step */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section icon={AlertTriangle} title="Priority">
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={analysis.priority_level} />
            <span className="text-sm font-medium">{analysis.urgency_level}</span>
          </div>
          <p className="text-sm text-muted-foreground">{analysis.priority_reason}</p>
        </Section>
        <Section icon={Target} title="Recommended Next Step">
          <p className="text-sm text-foreground font-medium">{analysis.recommended_next_step}</p>
        </Section>
      </div>

      {/* Key Details */}
      {analysis.key_details_detected?.length > 0 && (
        <Section icon={Zap} title="Key Details Detected">
          <ul className="space-y-1.5">
            {analysis.key_details_detected.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Missing Information */}
      {analysis.missing_information?.length > 0 && (
        <Section icon={Lightbulb} title="Missing Information">
          <ul className="space-y-1.5">
            {analysis.missing_information.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Draft Response */}
      <Section icon={MessageSquare} title="Suggested Response Draft">
        <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
          {analysis.suggested_response_draft}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={copyDraft}>
          <Copy className="h-3.5 w-3.5 mr-2" />Copy Draft
        </Button>
      </Section>

      {/* Internal Notes */}
      {analysis.internal_notes && (
        <Section icon={FileText} title="Internal Notes">
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.internal_notes}</p>
        </Section>
      )}

      {/* Follow-Up Checklist */}
      {analysis.follow_up_checklist?.length > 0 && (
        <Section icon={ListChecks} title="Follow-Up Checklist">
          <ul className="space-y-2">
            {analysis.follow_up_checklist.map((item, i) => (
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
      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={() => onSave()} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Intake'}
        </Button>
        <Button variant="outline" onClick={onSaveFollowUp} disabled={saving}>
          <Flag className="h-4 w-4 mr-2" />Mark as Needs Follow-Up
        </Button>
        <Button variant="outline" onClick={copyDraft}>
          <Copy className="h-4 w-4 mr-2" />Copy Draft Response
        </Button>
        <Button variant="ghost" onClick={onNew}>
          <Plus className="h-4 w-4 mr-2" />Create Another Intake
        </Button>
      </div>
    </div>
  );
}