import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  Calendar, 
  User, 
  Mail, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  Download,
  AlertCircle,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppLayout } from './DashboardPage';
import { DocNudgeStore } from '../lib/store';
import { DocumentRequest, RequestItem } from '../types';
import { formatDate } from '../lib/utils';

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const r = await DocNudgeStore.getRequestById(id);
      const itms = await DocNudgeStore.getRequestItems(id);
      setRequest(r);
      setItems(itms);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const publicLink = `${window.location.origin}/r/${request?.publicToken}`;
  
  const reminderMessage = request ? 
    `Hi ${request.clientName}, quick reminder from Premium Bookkeeping. We are still missing some documents for "${request.title}". Please upload them here: ${publicLink}` : '';

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleAction = (action: string) => {
    alert(`Action "${action}" is not available in the demo yet. Custom request management is coming soon.`);
  };

  const handleDownload = (itemName: string) => {
    // Generate a dummy text file
    const element = document.createElement("a");
    const file = new Blob([`Dummy data for ${itemName}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${itemName.toLowerCase().replace(/ /g, '_')}_mock.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const progress = {
    uploaded: items.filter(i => i.status === 'uploaded').length,
    total: items.length,
    percent: items.length > 0 ? Math.round((items.filter(i => i.status === 'uploaded').length / items.length) * 100) : 0
  };

  if (isLoading) return <AppLayout><div className="animate-pulse flex space-y-4 flex-col"><div className="h-4 bg-slate-200 rounded w-1/4"></div><div className="h-10 bg-slate-200 rounded"></div></div></AppLayout>;
  if (!request) return <AppLayout>Request not found</AppLayout>;

  return (
    <AppLayout>
      <button 
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{request.title}</h1>
                <StatusBadge status={request.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {request.clientName}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {request.clientEmail}</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Calendar className="w-4 h-4 text-blue-600" /> {formatDate(request.dueDate)}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Progress</div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-bold text-slate-600">{progress.uploaded}/{progress.total} Docs</span>
                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${progress.percent}%` }} />
                 </div>
              </div>
            </div>
          </header>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left order-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">File Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{item.title}</div>
                        {item.clientNote && (
                          <div className="text-xs italic text-slate-500 mt-0.5 flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 mt-0.5" /> "{item.clientNote}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'uploaded' ? (
                          <div className="flex items-center gap-1.5 text-xs">
                             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                             <span className="text-slate-600 truncate max-w-[120px] font-medium">{item.uploadedFileName}</span>
                          </div>
                        ) : item.status === 'unavailable' ? (
                          <div className="flex items-center gap-1.5 text-xs text-rose-500">
                             <AlertCircle className="w-3.5 h-3.5" />
                             <span>Marked "Don't have this"</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'uploaded' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleDownload(item.title)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <div className="relative group/menu">
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-20">
                               <button onClick={() => handleAction('Edit')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"><Edit className="w-3.5 h-3.5" /> Edit item</button>
                               <button onClick={() => handleAction('Review')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Mark for review</button>
                               <div className="border-t border-slate-100 my-1" />
                               <button onClick={() => handleAction('Delete')} className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 border-indigo-100 bg-indigo-50/30">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              Client Access
            </h3>
            <p className="text-sm text-slate-600 mb-4">Send this secure link to your client. No login required for them.</p>
            
            <div className="flex gap-2 mb-6">
              <input 
                readOnly 
                value={publicLink}
                className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 truncate"
              />
              <Button variant="secondary" size="icon" onClick={() => copyToClipboard(publicLink, setCopiedLink)}>
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <Button className="w-full h-11" variant="outline" onClick={() => navigate(`/r/${request.publicToken}?preview=true`)}>
              View Preview
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Reminder Tool
            </h3>
            <p className="text-sm text-slate-600 mb-4">Quick one-click message to nudge your client for missing items.</p>
            
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 mb-4 italic">
              "{reminderMessage}"
            </div>

            <Button 
              className="w-full gap-2" 
              variant="secondary"
              onClick={() => copyToClipboard(reminderMessage, setCopiedMsg)}
            >
              {copiedMsg ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copiedMsg ? 'Message Copied' : 'Copy Reminder Message'}
            </Button>
          </Card>

          <div className="text-center p-4">
             <p className="text-xs text-slate-400 mb-2">Automated reminders coming soon</p>
             <div className="h-1 w-full bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-indigo-200 w-1/3" />
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
