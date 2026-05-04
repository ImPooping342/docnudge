import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Mail, Building, Briefcase, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secretKey, setSecretKey] = useState(localStorage.getItem('admin_secret_key') || '');
  const navigate = useNavigate();

  const fetchLeads = async (key: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/leads', {
        headers: {
          'x-admin-key': key
        }
      });
      
      if (response.status === 401) {
        setIsAuthorized(false);
        localStorage.removeItem('admin_secret_key');
        return;
      }

      const data = await response.json();
      setLeads(data.reverse());
      setIsAuthorized(true);
      localStorage.setItem('admin_secret_key', key);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/leads/${id}/read`, {
        method: 'PATCH',
        headers: {
          'x-admin-key': secretKey
        }
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  useEffect(() => {
    if (secretKey) {
      fetchLeads(secretKey);
    } else {
      setIsLoading(false);
    }

    // Refresh leads every 30 seconds for "live" feel
    const interval = setInterval(() => {
      if (secretKey && isAuthorized) {
        fetchLeads(secretKey);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [secretKey, isAuthorized]);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(secretKey);
    requestNotificationPermission();
  };

  if (isLoading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-slate-100 p-3 rounded-full mb-4">
              <Lock className="w-6 h-6 text-slate-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Admin Access Required</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your secret key to view waitlist leads</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter admin secret key"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              autoFocus
            />
            <Button type="submit" className="w-full h-11 lg:hover:scale-[1.02] transition-transform">
              Authorize
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full h-11 text-slate-500">
              Back to Site
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Waitlist Leads</h1>
              <p className="text-slate-500 text-sm">Real-time submissions from the landing page</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Landing Page
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No leads yet</h2>
            <p className="text-slate-500">Go to the early access page and submit a test lead.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {leads.map((lead) => (
              <div key={lead.id} onMouseEnter={() => !lead.isRead && markAsRead(lead.id)}>
                <Card className={cn(
                  "p-6 transition-all duration-500",
                  !lead.isRead ? "ring-2 ring-blue-500 bg-blue-50 shadow-md" : "bg-white"
                )}>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                        {!lead.isRead && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                            NEW
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                          {lead.planClicked || 'Unknown'} Plan
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building className="w-4 h-4 text-slate-400" />
                          {lead.company}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          {lead.role}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Pain Point</p>
                        <p className="text-sm text-slate-700 italic">"{lead.biggestProblem}"</p>
                      </div>
                    </div>

                    <div className="md:text-right flex flex-col justify-between items-end">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(lead.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-4 flex flex-col items-end gap-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Clients Handle</div>
                        <div className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{lead.clientCount}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
