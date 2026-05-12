import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Save, Copy, Flag, Plus, Check, AlertTriangle,
  Target, MessageSquare, Lightbulb, ListChecks, FileText, Zap, ArrowRight
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { toast } from 'sonner';
import { useState } from 'react';

const urgencyColor = {
  'Immediate': 'bg-red-50 text-red-700 border-red-200',
  'Soon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Normal': 'bg-blue-50 text-blue-700 border-blue-200',
  'Low Urgency': 'bg-slate-50 text-slate-600 border-slate-200',
};
const sentimentColor = {
  'Positive': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Frustrated': 'bg-red-50 text-red-700 border-red-200',
  'Urgent': 'bg-amber-50 text-amber-700 border-amber-200',
  'Confused': 'bg-violet-50 text-violet-700 border-violet-200',
  'Negative': 'bg-red-50 text-red-700 border-red-200',
  'Neutral': 'bg-slate-50 text-slate-600 border-slate-200',
};
const oppColor = {
  'High': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medium': 'bg-blue-50 text-blue-700 border-blue-200',
  'Low': 'bg-slate-50 text-slate-600 border-slate-200',
  'Not Applicable': 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function AnalysisResult({ analysis, form, onSave, onSaveFollowUp, onNew, saving }) {
  const [copied, setCopied] = useState(false);
  const [draftText, setDraftText] = useState(analysis.suggested_response_draft || '');

  const copyDraft = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    toast.success('Response draft copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Triage Bar — the executive summary at a glance */}
      <Card className="p-5 border-l-4 border-l-primary bg-card">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">AI Summary</p>
            <p className="text-sm text-foreground leading-relaxed">{analysis.request_summary}</p>
          </div>
          <div className="shrink-0 flex flex-col gap-2 items-end">
            <div className="flex flex-wrap gap-1.5 justify-end">
              <PriorityBadge priority={analysis.priority_level} />
              <Badge variant="outline" className={`text-xs ${urgencyColor[analysis.urgency_level] || ''}`}>
                {analysis.urgency_level}
              </Badge>
              <Badge variant="outline" className={`text-xs ${sentimentColor[analysis.sentiment] || ''}`}>
                {analysis.sentiment}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                {analysis.request_category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${oppColor[analysis.business_opportunity_level] || ''}`}>
                Opportunity: {analysis.business_opportunity_level}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Next Step + Priority Reason — 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Target className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommended Next Step</p>
          </div>
          <p className="text-sm font-semibold text-foreground flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            {analysis.recommended_next_step}
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-amber-50">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority Reason</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.priority_reason}</p>
        </Card>
      </div>

      {/* Key Details + Missing Info — 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {analysis.key_details_detected?.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Details</p>
            </div>
            <ul className="space-y-2">
              {analysis.key_details_detected.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{d}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {analysis.missing_information?.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-amber-50">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Missing Information</p>
            </div>
            <ul className="space-y-2">
              {analysis.missing_information.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-foreground">{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Draft Response — prominent */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Suggested Response Draft</p>
          </div>
          <Button
            size="sm"
            variant={copied ? 'default' : 'outline'}
            onClick={copyDraft}
            className="h-7 px-3 text-xs shrink-0"
          >
            {copied ? (
              <><Check className="h-3 w-3 mr-1.5" />Copied!</>
            ) : (
              <><Copy className="h-3 w-3 mr-1.5" />Copy Draft</>
            )}
          </Button>
        </div>
        <textarea
          className="w-full bg-muted/50 rounded-lg p-4 text-sm leading-relaxed resize-none border border-border focus:outline-none focus:ring-2 focus:ring-ring min-h-[140px]"
          value={draftText}
          onChange={e => setDraftText(e.target.value)}
        />
      </Card>

      {/* Internal Notes + Checklist — 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {analysis.internal_notes && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-muted">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Internal Notes</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.internal_notes}</p>
          </Card>
        )}
        {analysis.follow_up_checklist?.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-muted">
                <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Follow-Up Checklist</p>
            </div>
            <ul className="space-y-2">
              {analysis.follow_up_checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="h-4.5 w-4.5 rounded border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-muted-foreground leading-none">{i + 1}</span>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
        <Button onClick={() => onSave({ suggested_response_draft: draftText })} disabled={saving} size="sm">
          <Save className="h-3.5 w-3.5 mr-1.5" />{saving ? 'Saving…' : 'Save Intake'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => onSaveFollowUp({ suggested_response_draft: draftText })} disabled={saving}>
          <Flag className="h-3.5 w-3.5 mr-1.5" />Save + Needs Follow-Up
        </Button>
        <Button variant="outline" size="sm" onClick={copyDraft}>
          <Copy className="h-3.5 w-3.5 mr-1.5" />Copy Response
        </Button>
        <Button variant="ghost" size="sm" onClick={onNew} className="text-muted-foreground ml-auto">
          <Plus className="h-3.5 w-3.5 mr-1.5" />New Intake
        </Button>
      </div>
    </div>
  );
}