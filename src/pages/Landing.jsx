import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight, FileText, AlertTriangle,
  MessageSquare, Users, Briefcase, ShoppingCart, Building2,
  Sparkles, Target, ListChecks, Mail, Check
} from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const outputs = [
  { icon: FileText, label: 'Clean request summary', desc: 'What the person actually wants, in plain language.' },
  { icon: AlertTriangle, label: 'Priority & urgency', desc: 'High, medium, or low — with a reason why.' },
  { icon: Target, label: 'Recommended next step', desc: 'One clear action to take right now.' },
  { icon: Sparkles, label: 'Missing information', desc: 'What you need before you can respond.' },
  { icon: MessageSquare, label: 'Ready-to-send draft', desc: 'A professional response, written for you.' },
  { icon: ListChecks, label: 'Follow-up checklist', desc: 'Short action list so nothing falls through the cracks.' },
];

const useCases = [
  { icon: Users, title: 'Lead Intake', desc: 'Qualify and prioritize sales leads automatically.' },
  { icon: MessageSquare, title: 'Support Requests', desc: 'Triage support tickets and surface urgent issues first.' },
  { icon: Briefcase, title: 'Client Projects', desc: 'Capture project requests and identify scope gaps.' },
  { icon: ShoppingCart, title: 'Vendor Inquiries', desc: 'Evaluate vendor proposals without the manual review.' },
  { icon: Building2, title: 'Internal Operations', desc: 'Process team requests with structure and clarity.' },
];

const steps = [
  { num: '1', title: 'Paste the request', desc: 'Drop in any email, message, or form submission.' },
  { num: '2', title: 'AI analyzes it', desc: 'Get priority, category, sentiment, and missing info in seconds.' },
  { num: '3', title: 'Take action', desc: 'Use the ready-to-send draft and next steps to respond fast.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center">
            <AppLogo className="h-9" />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="shadow-sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              AI-Powered Intake Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Turn messy requests into
              <span className="text-primary block">clear next steps.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              IntakeIQ analyzes any incoming business request and instantly produces a structured intake record — with priority, summary, missing info, and a ready-to-send response.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="px-8 shadow-md">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">No credit card required · Free to start</p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 border-y border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }) => (
              <motion.div key={num} {...fadeUp} className="text-center">
                <div className="h-10 w-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {num}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Everything you need to act on a request</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Every intake analysis includes these structured outputs — ready in seconds.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outputs.map(({ icon: Icon, label, desc }) => (
              <motion.div key={label} {...fadeUp}>
                <Card className="p-5 bg-white border-slate-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Built for every team that handles requests</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {useCases.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} {...fadeUp}>
                <Card className="p-5 text-center hover:shadow-sm transition-shadow border-slate-200">
                  <div className="p-2.5 rounded-xl bg-primary/10 inline-flex mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-14 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: '< 10 sec', label: 'Average analysis time' },
              { stat: '12+ fields', label: 'Per intake record' },
              { stat: '1 click', label: 'Copy & send response' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-primary">{stat}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Turn your next request into an action plan.
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-base">
              Start analyzing requests in seconds. No setup, no complexity.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="px-8 shadow-md font-semibold">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/70">
              {['No credit card', 'Set up in minutes', 'Cancel anytime'].map(t => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />{t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center">
            <AppLogo className="h-7" />
          </div>
          <span>Turn messy requests into clear next steps.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-slate-600 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}