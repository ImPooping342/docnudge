import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, LayoutDashboard, Send, Timer, FileCheck, XCircle, ChevronRight, UserCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">DocNudge</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-sm font-medium text-slate-500 italic">Not another client portal.</span>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/early-access')}>
              Start €29 Early Access
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> Early Access: Onboarding small batches
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Stop begging clients for <span className="text-blue-600">missing receipts.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Paste a missing-document list, send one no-login upload link, and track what is uploaded, missing, or needs another reminder.
            </p>
            <p className="text-sm text-slate-500 mb-10 font-medium border-l-2 border-blue-600 pl-4">
              Built for bookkeepers, tax preparers, and small accounting firms.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg shadow-blue-200" onClick={() => navigate('/early-access')}>
                Start €29 Early Access
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8" onClick={() => navigate('/app')}>
                See demo
              </Button>
            </div>
            <p className="mt-8 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Private upload links. No client account required.
            </p>
          </motion.div>

          {/* Dashboard Preview Overlaying Client View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full -z-10" />
            
            {/* Phone Mockup (Client View) */}
            <div className="absolute -left-12 -bottom-20 hidden md:block z-20 group">
              <div className="w-[240px] h-[400px] border-[6px] border-slate-900 rounded-[32px] bg-white shadow-2xl overflow-hidden ring-4 ring-white">
                <div className="bg-blue-600 p-4 text-white text-center">
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Client Upload Link</p>
                  <p className="text-xs font-bold">Missing Documents</p>
                </div>
                <div className="p-3 space-y-3 bg-slate-50 h-full">
                   <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                      <div className="h-3 w-3/4 bg-slate-100 rounded mb-2" />
                      <div className="h-8 w-full border border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold">
                        TAP TO UPLOAD
                      </div>
                   </div>
                   <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm opacity-50">
                      <div className="h-2 w-1/2 bg-emerald-100 rounded mb-1" />
                      <div className="text-[8px] text-emerald-600 font-bold">✓ UPLOADED</div>
                   </div>
                   <div className="pt-2">
                     <Button size="sm" variant="outline" className="w-full text-[10px] h-7" onClick={() => navigate('/app')}>
                        See full client demo
                     </Button>
                   </div>
                </div>
              </div>
            </div>

            {/* Desktop Mockup (Accountant View) */}
            <Card className="shadow-2xl border-slate-200 overflow-hidden text-left bg-white relative z-10">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="font-bold text-slate-400 uppercase tracking-widest">Active Requests</div>
                  <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-bold">12 Total</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg bg-slate-50/50">
                    <span className="font-bold text-slate-700 text-sm">Oak Cafe</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">7 Missing</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg bg-slate-50/50">
                    <span className="font-bold text-slate-700 text-sm">Sarah Miller</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Complete</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-8">
                Client document collection is still broken.
              </h2>
              <div className="space-y-4">
                {[
                  'Clients ignore complex portals.',
                  'Email attachments get lost in infinite threads.',
                  'WhatsApp photos are blurry and messy.',
                  'Dropbox and Drive folders become chaotic.',
                  'You forget exactly what is still missing.',
                  'Clients swear they "already sent it".',
                  'Follow-ups eat billable time every week.',
                ].map((pain) => (
                  <div key={pain} className="flex gap-4 items-start focus-within:">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-lg text-slate-600 leading-snug">{pain}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-6">Not another client portal.</h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                DocNudge is not practice-management software. It is a focused missing-document chaser for the ugly gap between <strong>"please send these documents"</strong> and <strong>"the client finally sent them."</strong>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 uppercase mb-1">Focus</div>
                  <div className="text-sm font-medium">Only missing-doc requests</div>
                  <div className="text-[10px] text-slate-400 mt-1">No CRM, no task suite, no full portal.</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 uppercase mb-1">UX</div>
                  <div className="text-sm font-medium">No client login</div>
                  <div className="text-[10px] text-slate-400 mt-1">Clients open one link, upload files, and leave.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From messy follow-up email to clean client checklist.</h2>
            <p className="text-slate-600 text-lg">Stop digging through email threads and see exactly what is still missing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 relative items-center">
             <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm opacity-80 scale-95">
                <div className="text-xs font-bold text-slate-400 mb-4 uppercase">The Mess (Old Way)</div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 font-mono text-sm leading-relaxed text-slate-700">
                  <p className="mb-2">Hi Sarah, hope you're well.</p>
                  <p className="mb-2">We are still missing quite a few things for March:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>That one Uber receipt from the 12th</li>
                    <li>March bank statement (PDF please)</li>
                    <li>ACME Ltd invoice?</li>
                    <li>Wait, did you send the fuel receipt?</li>
                  </ul>
                  <p>Check your WhatsApp I think I asked there too...</p>
                </div>
             </div>
             
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-blue-600 p-3 rounded-full text-white shadow-xl hidden md:block">
                <ChevronRight className="w-8 h-8" />
             </div>

             <div className="p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-xl relative ring-4 ring-blue-50">
                <div className="text-xs font-bold text-blue-600 mb-4 uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> The DocNudge Way (MVP)
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <span className="text-sm font-bold text-slate-800">March Bank Statement</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Missing</span>
                   </div>
                   <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-emerald-50 border-emerald-100">
                      <span className="text-sm font-bold text-emerald-800">Uber Receipt - 12 March</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Uploaded</span>
                   </div>
                   <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <span className="text-sm font-bold text-slate-800">Supplier Invoice ACME</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Missing</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-16">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Paste the missing list', icon: LayoutDashboard },
              { step: '02', title: 'Send one no-login link', icon: Send },
              { step: '03', title: 'Client uploads from phone', icon: Timer },
              { step: '04', title: 'Track every item', icon: CheckCircle2 },
              { step: '05', title: 'Download the files', icon: FileCheck },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 transition-colors">
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-slate-500 mb-2">{s.step}</div>
                <div className="font-semibold text-lg leading-tight">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transparent beta pricing.</h2>
            <p className="text-slate-600 text-lg">Reserve beta pricing. We are onboarding firms in small batches and will not charge until your workspace is ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            <PricingCard 
              name="First Request Test"
              price="49"
              period="one-time"
              features={['One client request', 'Up to 30 missing items', 'Early support', 'Feedback call']}
              cta="Test One Request"
              onClick={() => navigate('/early-access?plan=pilot')}
            />
            <PricingCard 
              name="Early Access Solo"
              price="29"
              period="/month"
              featured
              features={['Unlimited client links', 'Missing-doc checklists', 'Copy-ready reminder messages', 'File uploads', 'Status dashboard']}
              cta="Start €29 Early Access"
              onClick={() => navigate('/early-access?plan=solo')}
            />
            <PricingCard 
              name="Small Firm"
              price="79"
              period="/month"
              features={['Everything in Solo', 'Multiple active clients', 'Request templates (coming soon)', 'Team view (coming soon)']}
              cta="Reserve Spot"
              onClick={() => navigate('/early-access?plan=firm')}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Common questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Is this a client portal?', a: 'No. DocNudge is intentionally smaller. It creates no-login upload checklists for missing documents.' },
              { q: 'Do clients need an account?', a: 'No. Clients open one secure link and upload what is missing. No passwords for them to forget.' },
              { q: 'Is this accounting software?', a: 'No. It does not categorize transactions or do bookkeeping. It only helps collect the missing source documents.' },
              { q: "Is this secure enough for client documents?", a: "DocNudge uses private upload links and keeps client uploads organized by request. During beta, we are keeping the product intentionally simple and will expand security and compliance controls based on firm feedback." },
              { q: "Is this available now?", a: "Yes, early access is open. We are onboarding firms in small batches so we can support real workflows properly." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6">
                <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-500" />
                  {faq.q}
                </h4>
                <p className="text-slate-600 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold">DocNudge</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 DocNudge. Private upload links. No client account required.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ name, price, period, features, featured = false, cta, onClick }: any) {
  return (
    <Card className={cn(
      'flex flex-col p-8 transition-all h-full overflow-visible',
      featured ? 'ring-2 ring-blue-600 transform scale-105 shadow-xl relative z-20 bg-white' : 'bg-white'
    )}>
      {featured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg">
          MOST POPULAR
        </div>
      )}
      <div className="mb-6 pt-2">
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight">€{price}</span>
          <span className="ml-1 text-slate-500 text-sm">{period}</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 mb-8">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 text-sm text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <Button 
        variant={featured ? 'primary' : 'secondary'} 
        className="w-full text-lg py-6"
        onClick={onClick}
      >
        {cta}
      </Button>
    </Card>
  );
}
