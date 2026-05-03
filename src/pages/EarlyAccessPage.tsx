import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileCheck, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DocNudgeStore } from '../lib/store';

export default function EarlyAccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const plan = searchParams.get('plan') || 'solo';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    currentTool: '',
    clientCount: '',
    biggestProblem: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    await DocNudgeStore.saveEarlyAccessLead({
      ...formData,
      planClicked: plan,
    });
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-emerald-100 text-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">You're on the list!</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            We're onboarding early users in small batches. When our queue reaches you, we'll send your access link to <strong>{formData.email}</strong>.
          </p>
          <div className="space-y-4">
            <Button className="w-full h-12" onClick={() => navigate('/app')}>
              Go to Sandbox Demo
            </Button>
            <Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Landing Page
        </Link>
        
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DocNudge Early Access</h1>
        </div>

        <Card className="p-8 shadow-xl">
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
            <div className="bg-white p-2 rounded-lg border border-blue-200 h-fit">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Selection: {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h4>
              <p className="text-sm text-blue-700">We are onboarding early users in small batches. Tell us about your workflow and we’ll send access if there is a fit.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="john@firm.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Acme Bookkeeping"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select 
                  required
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="">Select Role</option>
                  <option value="bookkeeper">Bookkeeper</option>
                  <option value="tax_preparer">Tax preparer</option>
                  <option value="accountant">Accountant / CPA</option>
                  <option value="owner">Firm owner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">How many clients do you handle?</label>
                <select 
                  required
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={formData.clientCount}
                  onChange={(e) => setFormData({...formData, clientCount: e.target.value})}
                >
                  <option value="">Select Range</option>
                  <option value="1-10">1–10</option>
                  <option value="11-30">11–30</option>
                  <option value="31-100">31–100</option>
                  <option value="100+">100+</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">What do you use today for document collection?</label>
              <select 
                required
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.currentTool}
                onChange={(e) => setFormData({...formData, currentTool: e.target.value})}
              >
                <option value="">Select current method</option>
                <option value="email">Email</option>
                <option value="messaging">WhatsApp / SMS</option>
                <option value="cloud_storage">Google Drive / Dropbox</option>
                <option value="portal">Client portal</option>
                <option value="mix">Mix of everything</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Biggest document collection problem?</label>
              <select 
                required
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.biggestProblem}
                onChange={(e) => setFormData({...formData, biggestProblem: e.target.value})}
              >
                <option value="">Select Primary Issue</option>
                <option value="ignored_portals">Clients ignore portals</option>
                <option value="messy_channels">Documents arrive across email/WhatsApp/Drive</option>
                <option value="blurry_missing">Receipts are blurry or missing</option>
                <option value="forgotten">I forget what is still missing</option>
                <option value="time_followups">Follow-ups take too much time</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button isLoading={isLoading} className="w-full h-14 text-lg font-bold shadow-blue-200 shadow-lg" type="submit">
              Request Early Access
            </Button>
            <p className="text-center text-xs text-slate-400">
              No payment required yet. We'll verify your workflow before charging beta rates.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
