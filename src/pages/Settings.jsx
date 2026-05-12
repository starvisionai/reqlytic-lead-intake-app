import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const tones = ['Professional', 'Friendly', 'Concise', 'Consultative', 'Formal'];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: '',
    business_email: '',
    website: '',
    primary_services: '',
    preferred_tone: 'Professional',
    default_follow_up_cta: '',
    default_scheduling_link: '',
    default_signature_block: '',
  });

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      setSettings(prev => ({
        ...prev,
        business_name: me.business_name || '',
        business_email: me.business_email || '',
        website: me.website || '',
        primary_services: me.primary_services || '',
        preferred_tone: me.preferred_tone || 'Professional',
        default_follow_up_cta: me.default_follow_up_cta || '',
        default_scheduling_link: me.default_scheduling_link || '',
        default_signature_block: me.default_signature_block || '',
      }));
      setLoading(false);
    };
    load();
  }, []);

  const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(settings);
    setSaving(false);
    toast.success('Settings saved');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Customize your IntakeIQ experience</p>
      </div>

      {/* Company Profile */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold">Company Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input value={settings.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Your business name" />
          </div>
          <div className="space-y-2">
            <Label>Business Email</Label>
            <Input type="email" value={settings.business_email} onChange={e => update('business_email', e.target.value)} placeholder="hello@company.com" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={settings.website} onChange={e => update('website', e.target.value)} placeholder="https://company.com" />
          </div>
          <div className="space-y-2">
            <Label>Preferred Tone</Label>
            <Select value={settings.preferred_tone} onValueChange={v => update('preferred_tone', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {tones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Primary Services</Label>
          <Textarea
            value={settings.primary_services}
            onChange={e => update('primary_services', e.target.value)}
            placeholder="Describe your main services..."
            className="min-h-[80px]"
          />
        </div>
      </Card>

      {/* Response Preferences */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold">Default Response Preferences</h2>
        <div className="space-y-2">
          <Label>Default Follow-Up Call-to-Action</Label>
          <Input
            value={settings.default_follow_up_cta}
            onChange={e => update('default_follow_up_cta', e.target.value)}
            placeholder="e.g., Schedule a free consultation"
          />
        </div>
        <div className="space-y-2">
          <Label>Default Scheduling Link</Label>
          <Input
            value={settings.default_scheduling_link}
            onChange={e => update('default_scheduling_link', e.target.value)}
            placeholder="e.g., https://calendly.com/your-name"
          />
        </div>
        <div className="space-y-2">
          <Label>Default Signature Block</Label>
          <Textarea
            value={settings.default_signature_block}
            onChange={e => update('default_signature_block', e.target.value)}
            placeholder="e.g., Best regards,&#10;Jane Smith&#10;Acme Consulting"
            className="min-h-[100px]"
          />
        </div>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
        ) : (
          <><Save className="h-4 w-4 mr-2" />Save Settings</>
        )}
      </Button>
    </div>
  );
}