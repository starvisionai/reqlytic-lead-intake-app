import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import AnalysisResult from '@/components/intake/AnalysisResult';

const sources = ['Contact Form', 'Email', 'Phone Call Notes', 'Referral', 'Social Media', 'Internal Request', 'Other'];
const requestTypes = ['Unknown', 'Sales Inquiry', 'Support Request', 'Client Project Request', 'Vendor Inquiry', 'Internal Operations Request', 'Partnership Request', 'General Question'];

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

    // Fetch user settings for tone preferences
    let userSettings = {};
    try {
      const me = await base44.auth.me();
      if (me?.preferred_tone || me?.business_name) {
        userSettings = me;
      }
    } catch {}

    const toneInstruction = userSettings.preferred_tone
      ? `Use a ${userSettings.preferred_tone.toLowerCase()} tone in the response draft.`
      : 'Use a professional tone in the response draft.';

    const businessContext = userSettings.business_name
      ? `The business is called "${userSettings.business_name}".`
      : '';

    const signatureBlock = userSettings.default_signature_block || '';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI business intake analyst. Analyze the following incoming business request and produce a structured intake analysis.

${businessContext}
${toneInstruction}
${signatureBlock ? `Include this signature at the end of the response draft: ${signatureBlock}` : ''}

Contact Name: ${form.contact_name || 'Not provided'}
Contact Email: ${form.contact_email || 'Not provided'}
Company: ${form.company_name || 'Not provided'}
Source: ${form.source || 'Not provided'}
Request Type: ${form.original_request_type || 'Unknown'}
Additional Notes: ${form.optional_notes || 'None'}

RAW REQUEST MESSAGE:
${form.raw_request_message}

Analyze this request thoroughly. Do not make assumptions about things not stated. If information is missing, list it clearly. Keep the response draft professional and practical.`,
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
    const record = {
      ...form,
      ...analysis,
      ...overrides,
      status: overrides.status || 'New',
    };
    const created = await base44.entities.IntakeRecord.create(record);
    setSaving(false);
    navigate(`/intake/${created.id}`);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Intake</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a request to analyze with AI</p>
      </div>

      {!analysis ? (
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                placeholder="Jane Smith"
                value={form.contact_name}
                onChange={e => update('contact_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                placeholder="jane@company.com"
                value={form.contact_email}
                onChange={e => update('contact_email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                placeholder="Acme Corp"
                value={form.company_name}
                onChange={e => update('company_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={v => update('source', v)}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select value={form.original_request_type} onValueChange={v => update('original_request_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {requestTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Raw Request Message <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Paste the incoming request, email, message, or inquiry here..."
              className="min-h-[160px]"
              value={form.raw_request_message}
              onChange={e => update('raw_request_message', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Optional Notes</Label>
            <Textarea
              placeholder="Add any context or internal notes..."
              className="min-h-[80px]"
              value={form.optional_notes}
              onChange={e => update('optional_notes', e.target.value)}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!form.raw_request_message.trim() || analyzing}
            className="w-full sm:w-auto"
            size="lg"
          >
            {analyzing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" />Analyze Request</>
            )}
          </Button>
        </Card>
      ) : (
        <AnalysisResult
          analysis={analysis}
          form={form}
          onSave={handleSave}
          onSaveFollowUp={() => handleSave({ status: 'Needs Follow-Up' })}
          onNew={() => {
            setAnalysis(null);
            setForm({
              contact_name: '', contact_email: '', company_name: '',
              source: '', original_request_type: 'Unknown',
              raw_request_message: '', optional_notes: '',
            });
          }}
          saving={saving}
        />
      )}
    </div>
  );
}