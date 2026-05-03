import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  FileCheck, 
  LayoutGrid,
  Users,
  Settings,
  Bell,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DocNudgeStore } from '../lib/store';
import { DocumentRequest, UserProfile, RequestItem } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate, cn } from '../lib/utils';

export default function DashboardPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = DocNudgeStore.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [reqData, itemData] = await Promise.all([
        DocNudgeStore.getRequests(),
        DocNudgeStore.getAllItems()
      ]);
      setRequests(reqData);
      setItems(itemData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const stats = {
    active: requests.length,
    missing: items.filter(i => i.status === 'missing').length,
    uploaded: items.filter(i => i.status === 'uploaded').length,
    needsReview: items.filter(i => i.status === 'uploaded').length // MVP: all uploaded need review
  };

  const getRequestProgress = (requestId: string) => {
    const requestItems = items.filter(i => i.requestId === requestId);
    const uploaded = requestItems.filter(i => i.status === 'uploaded').length;
    const total = requestItems.length;
    const percent = total > 0 ? Math.round((uploaded / total) * 100) : 0;
    return { uploaded, total, percent };
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="animate-spin text-slate-300 w-8 h-8" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Requests</h1>
          <p className="text-slate-500">Track and manage your missing document checklists.</p>
        </div>
        <Button onClick={() => navigate('/app/new')} className="h-11">
          <Plus className="w-4 h-4 mr-2" />
          New Document Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Requests" value={stats.active.toString()} icon={ExternalLink} />
        <StatCard title="Missing Items" value={stats.missing.toString()} icon={Clock} color="amber" />
        <StatCard title="Uploaded Files" value={stats.uploaded.toString()} icon={FileCheck} color="emerald" />
        <StatCard title="Needs Review" value={stats.needsReview.toString()} icon={MessageSquare} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Main List Column */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">All Requests</h3>
               <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                 {requests.length} Total Requests
               </div>
            </div>
            <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/50 cursor-pointer group" onClick={() => navigate(`/app/requests/${request.id}`)}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{request.title}</div>
                    <div className="text-xs text-slate-400 mt-1">ID: {request.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{request.clientName}</div>
                    <div className="text-xs text-slate-500">{request.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-slate-600">
                        {getRequestProgress(request.id).uploaded}/{getRequestProgress(request.id).total} uploaded
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-500" 
                          style={{ width: `${getRequestProgress(request.id).percent}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(request.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
        
    {/* Right Sidebar Column */}
    <div className="space-y-6">
          <Card className="p-5 border-blue-100 bg-blue-50/20">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-blue-600" />
               Getting started
             </h3>
             <ul className="space-y-4">
                {[
                  'Create a missing-doc request',
                  'Copy the client upload link',
                  'Client uploads files',
                  'Review completed items'
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                    <span className="text-slate-600">{step}</span>
                  </li>
                ))}
             </ul>
          </Card>

          <Card className="p-5">
             <h3 className="font-bold text-slate-900 mb-4">Recent activity</h3>
             <div className="space-y-4">
                {[
                  { text: 'Oak Cafe uploaded March bank statement', time: '2h ago' },
                  { text: 'Sarah Miller marked supplier invoice unavailable', time: '5h ago' },
                  { text: 'Nova Repairs opened request link', time: 'Yesterday' }
                ].map((act, i) => (
                  <div key={i} className="flex gap-3 items-start border-l-2 border-slate-100 pl-4 py-1">
                     <div>
                       <p className="text-[13px] leading-snug text-slate-700">{act.text}</p>
                       <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{act.time}</p>
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
      
      {requests.length === 0 && (
          <div className="p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No requests yet</h3>
            <p className="text-slate-500 mb-6">Create your first checklist to start collecting documents.</p>
            <Button onClick={() => navigate('/app/new')}>Create Request</Button>
          </div>
        )}
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, color = 'indigo' }: any) {
  const colors: any = {
    indigo: 'text-indigo-600 bg-indigo-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    rose: 'text-rose-600 bg-rose-50',
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-xl', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = DocNudgeStore.getUser();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col p-4 sticky top-0 h-screen hidden lg:flex">
        <div className="px-3 py-6 flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DocNudge</span>
        </div>
        
        <nav className="flex-1 space-y-1 mt-4">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workspace</div>
          <Link to="/app" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white font-medium">
            <LayoutGrid className="w-5 h-5 text-slate-400" />
            Dashboard
          </Link>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors opacity-50 cursor-not-allowed">
            <Users className="w-5 h-5" />
            Clients
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        {/* Feedback area removed as requested for demo */}
        <div className="mt-auto p-4 flex flex-col items-center gap-2">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full border-2 border-slate-700" alt="Support" />
           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Support Active</p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{user?.firmName}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
          <div className="lg:hidden flex items-center gap-2">
             <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">D</span>
             </div>
             <span className="font-bold text-slate-900">DocNudge</span>
          </div>
          <div className="hidden lg:block text-sm font-medium text-slate-500 italic">
            Not another client portal.
          </div>
          <div className="flex items-center gap-6">
            <button 
              className="p-2 text-slate-400 hover:text-slate-600 relative group"
              onClick={() => alert('No new notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-3 hidden group-hover:block z-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notifications</p>
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-600 p-2 bg-slate-50 rounded">Welcome to DocNudge MVP!</div>
                </div>
              </div>
            </button>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>Back to Site</Button>
          </div>
        </header>

        <main className="p-8 flex-1">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
// Export AppLayout for use in other pages
export { AppLayout };
