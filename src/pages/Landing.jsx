import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Zap, ArrowRight, FileText, AlertTriangle, CheckCircle,
  MessageSquare, Users, Briefcase, ShoppingCart, Building2,
  Sparkles, Target, ListChecks, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const outputs = [
  { icon: FileText, label: 'Clean request summary' },
  { icon: Target, label: 'Request category' },
  { icon: AlertTriangle, label: 'Priority & urgency' },
  { icon: Sparkles, label: 'Missing information' },
  { icon: ListChecks, label: 'Recommended next step' },
  { icon: Mail, label: 'Ready-to-send response draft' },
];

const useCases = [
  { icon: Users, title: 'Lead Intake', desc: 'Qualify and prioritize incoming sales leads automatically.' },
  { icon: MessageSquare, title: 'Support Requests', desc: 'Triage support tickets and surface urgent issues.' },
  { icon: Briefcase, title: 'Client Projects', desc: 'Capture project requests and identify missing scope details.' },
  { icon: ShoppingCart, title: 'Vendor Inquiries', desc: 'Evaluate vendor proposals and prioritize responses.' },
  { icon: Building2, title: 'Internal Operations', desc: 'Process internal requests from teams and departments.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">IntakeIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Intake Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              AI-powered intake clarity for every business request.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              IntakeIQ helps small businesses and service teams summarize, prioritize, and respond to incoming requests faster.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4 sm:px-6 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold tracking-tight">Incoming requests are messy</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Businesses receive unstructured inquiries from contact forms, emails, clients, vendors, support channels, and internal teams. Each one requires manual review, prioritization, clarification, and follow-up — slowing everything down.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Turn chaos into clarity</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              IntakeIQ transforms unstructured messages into organized business intake records with everything you need to act fast.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outputs.map(({ icon: Icon, label }) => (
              <Card key={label} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="font-medium text-sm">{label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Built for every type of request</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-accent inline-flex mb-4">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Turn your next request into an action plan.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start analyzing requests in seconds. No complex setup required.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-8 px-8">
              Start Analyzing Requests <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium">IntakeIQ</span>
          </div>
          <span>Turn messy requests into clear next steps.</span>
        </div>
      </footer>
    </div>
  );
}