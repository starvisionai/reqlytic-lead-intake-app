import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import AnalysisResult from '@/components/intake/AnalysisResult';

const sources = ['Contact Form', 'Email', 'Phone Call Notes', 'Referral', 'Social Media', 'Internal Request', 'Other'];
const requestTypes = ['Unknown', 'Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question'];

// Concise, structured AI prompt — minimal tokens, consistent output
function buildPrompt(form, settings) {
  const lines = [
    'Analyze this business intake request. Be concise. Return only structured data — no filler text.',
    '',
    '## Business Context',
    settings.business_name ? `Business: ${settings.business_name}` : null,
    settings.primary_services ? `Services: ${settings.primary_services}` : null,
    `Tone for response draft: ${settings.preferred_tone || 'Professional'}`,
    settings.default_scheduling_link ? `Scheduling link: ${settings.default_scheduling_link}` : null,
    settings.default_signature_block ? `Signature: ${settings.default_signature_block}` : null,
    '',
    '## Intake Details',
    form.contact_name ? `Contact: ${form.contact_name}` : null,
    form.company_name ? `Company: ${form.company_name}` : null,
    form.source ? `Source: ${form.source}` : null,
    form.original_request_type !== 'Unknown' ? `Type hint: ${form.original_request_type}` : null,
    form.optional_notes ? `Internal notes: ${form.optional_notes}` : null,
    '',
    '## Request Message',
    form.raw_request_message.trim(),
    '',
    '## Output Rules',
    '- request_summary: 2–3 sentences max',
    '- priority_reason: 1 sentence',
    '- key_details_detected: 3–6 bullet strings (fact-only, no elaboration)',
    '- missing_information: 2–5 questions needed before responding',
    '- recommended_next_step: single action phrase',
    '- suggested_response_draft: 4–8 sentences, professional, natural, no placeholders',
    '- internal_notes: 1–2 sentences for internal team only',
    '- follow_up_checklist: 3–5 items max',
  ].filter(Boolean);

  return lines.join('\n');
}

export default function NewIntake() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    contact_name: '',
    contact_email: '',
    company_name: '',
    source: '',
    original_request_type: 'Unknown',
    raw_request_message: '',
    optional_notes: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAnalyze = async () => {
    if (!form.raw_request_message.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);

    let settings = {};
    try {
      const me = await base44.auth.me();
      settings = {
        business_name: me.business_name || '',
        primary_services: me.primary_services || '',
        preferred_tone: me.preferred_tone || 'Professional',
        default_scheduling_link: me.default_scheduling_link || '',
        default_signature_block: me.default_signature_block || '',
      };
    } catch {}

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: buildPrompt(form, settings),
      response_json_schema: {
        type: 'object',
        properties: {
          request_summary: { type: 'string' },
          request_category: {
            type: 'string',
            enum: ['Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question', 'Spam or Low Value', 'Other']
          },
          priority_level: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          priority_reason: { type: 'string' },
          urgency_level: { type: 'string', enum: ['Immediate', 'Soon', 'Normal', 'Low Urgency'] },
          business_opportunity_level: { type: 'string', enum: ['High', 'Medium', 'Low', 'Not Applicable'] },
          sentiment: { type: 'string', enum: ['Positive', 'Neutral', 'Frustrated', 'Urgent', 'Confused', 'Negative'] },
          key_details_detected: { type: 'array', items: { type: 'string' } },
          missing_information: { type: 'array', items: { type: 'string' } },
          recommended_next_step: { type: 'string' },
          suggested_response_draft: { type: 'string' },
          internal_notes: { type: 'string' },
          follow_up_checklist: { type: 'array', items: { type: 'string' } },
        }
      }
    });

    setAnalysis(result);
    setAnalyzing(false);
  };

  const handleSave = async (overrides = {}) => {
    setSaving(true);
    const record = { ...form, ...analysis, ...overrides, status: overrides.status || 'New' };
    const created = await base44.entities.IntakeRecord.create(record);
    setSaving(false);
    navigate(`/intake/${created.id}`);
  };

  const resetForm = () => {
    setAnalysis(null);
    setForm({ contact_name: '', contact_email: '', company_name: '', source: '', original_request_type: 'Unknown', raw_request_message: '', optional_notes: '' });
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">New Intake</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {analysis ? 'Review AI analysis and save the intake record' : 'Fill in the request details and run AI analysis'}
          </p>
        </div>
        {analysis && (
          <Button variant="ghost" size="sm" onClick={resetForm} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />Edit Form
          </Button>
        )}
      </div>

      {!analysis ? (
        <Card className="divide-y divide-border overflow-hidden">
          {/* Contact section */}
          <div className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Details <span className="text-muted-foreground font-normal normal-case">(optional)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Name</Label>
                <Input placeholder="Jane Smith" value={form.contact_name} onChange={e => update('contact_name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Email</Label>
                <Input type="email" placeholder="jane@company.com" value={form.contact_email} onChange={e => update('contact_email', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Company</Label>
                <Input placeholder="Acme Corp" value={form.company_name} onChange={e => update('company_name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Source</Label>
                <Select value={form.source} onValueChange={v => update('source', v)}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Request Type</Label>
                <Select value={form.original_request_type} onValueChange={v => update('original_request_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{requestTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Message section */}
          <div className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Request Message</p>
            <div className="space-y-1.5">
              <Label className="text-xs">
                Raw Request <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Paste the incoming email, message, or form submission here…"
                className="min-h-[180px] text-sm leading-relaxed resize-none"
                value={form.raw_request_message}
                onChange={e => update('raw_request_message', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Tip: paste the full original message for the most accurate analysis.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Internal Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                placeholder="Any context you want the AI to factor in…"
                className="min-h-[72px] text-sm resize-none"
                value={form.optional_notes}
                onChange={e => update('optional_notes', e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="px-5 py-4 bg-muted/30 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Analysis takes ~5–10 seconds</p>
            <Button
              onClick={handleAnalyze}
              disabled={!form.raw_request_message.trim() || analyzing}
              size="sm"
              className="shrink-0"
            >
              {analyzing ? (
                <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />Analyzing…</>
              ) : (
                <><Sparkles className="h-3.5 w-3.5 mr-2" />Analyze Request</>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <AnalysisResult
          analysis={analysis}
          form={form}
          onSave={handleSave}
          onSaveFollowUp={() => handleSave({ status: 'Needs Follow-Up' })}
          onNew={resetForm}
          saving={saving}
        />
      )}
    </div>
  );
}