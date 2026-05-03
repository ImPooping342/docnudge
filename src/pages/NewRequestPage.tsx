import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AppLayout } from './DashboardPage';
import { DocNudgeStore } from '../lib/store';

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    title: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    itemsText: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const items = formData.itemsText.split('\n').filter(line => line.trim() !== '');
    
    try {
      const request = await DocNudgeStore.saveRequest(
        {
          userId: 'user_1', // Mock user
          clientId: 'cli_' + Math.random().toString(36).substr(2, 9),
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          title: formData.title,
          dueDate: formData.dueDate,
        },
        items
      );
      
      console.log('Request created:', request);
      navigate(`/app/requests/${request.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Document Request</h1>
          <p className="text-slate-500">Create a clean checklist for your client to upload missing files.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Request Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g. March 2026 Bookkeeping Cleanup"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Sarah Miller"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="sarah@miller.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Due Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Missing Items Checklist</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {formData.itemsText.split('\n').filter(l => l.trim()).length} Items
                  </span>
                  <span className="text-xs text-slate-400">One item per line</span>
                </div>
              </div>
              <textarea 
                required
                className="w-full h-48 p-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed" 
                placeholder={`March bank statement\nUber receipt — 12 March\nExplanation for €420 transfer on 18 March\nSupplier invoice from ACME\nForm 1099-NEC`}
                value={formData.itemsText}
                onChange={(e) => setFormData({...formData, itemsText: e.target.value})}
              />
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100 italic">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-700 font-medium">Tip: This will create {formData.itemsText.split('\n').filter(l => l.trim()).length} separate checklist items for your client.</span>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => navigate('/app')}>Cancel</Button>
            <Button size="lg" className="h-12 px-8 font-bold shadow-lg shadow-blue-100" isLoading={isLoading} type="submit">
              Create Request Link
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
