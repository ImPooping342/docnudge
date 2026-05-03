import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  AlertCircle, 
  Loader2, 
  MessageSquare,
  Clock,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { DocNudgeStore } from '../lib/store';
import { DocumentRequest, RequestItem, RequestStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export default function ClientUploadPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<RequestItem | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const r = await DocNudgeStore.getRequestByToken(token);
      if (r) {
        const itms = await DocNudgeStore.getRequestItems(r.id);
        setRequest(r);
        setItems(itms);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [token]);

  const updateItemStatus = async (itemId: string, updates: Partial<RequestItem>) => {
    const updated = await DocNudgeStore.updateRequestItem(itemId, updates);
    if (updated) {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updated } : i));
    }
  };

  const completedCount = items.filter(i => i.status === 'uploaded' || i.status === 'unavailable').length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (isLoading) return <LoadingState />;
  if (!request) return <ErrorState />;

  if (isDone) return <SuccessState clientName={request.clientName} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {isPreview && request && (
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
             Preview Mode
           </div>
           <Button 
             variant="ghost" 
             size="sm" 
             className="text-white hover:bg-slate-800 h-8 text-[11px] font-bold"
             onClick={() => navigate(`/app/requests/${request.id}`)}
           >
             <ArrowLeft className="w-3 h-3 mr-1" /> Back to Editor
           </Button>
        </div>
      )}
      {/* Header */}
      <header className={cn("bg-white border-b border-slate-200 px-4 py-8 text-center sticky z-10", isPreview ? "top-10" : "top-0")}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight">DocNudge</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Documents for {request.title}
          </h1>
          <p className="text-slate-600 mb-6">
            Your bookkeeper is missing a few documents. Upload each item below. No account required.
          </p>
          
          <div className="max-w-md mx-auto">
             <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-600">Your Progress</span>
                <span className="text-indigo-600">{completedCount} of {items.length} items</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-indigo-600"
                />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-8">
           <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
           <p className="text-sm text-blue-800 leading-snug">
             <strong>Secure Upload:</strong> Your bookkeeper will receive these files directly. No account required for you.
           </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onUpload={() => setActiveItem(item)}
              onSkip={(reason) => updateItemStatus(item.id, { status: 'unavailable', clientNote: reason })}
            />
          ))}
        </div>

        {completedCount === items.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-10"
          >
            <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={() => setIsDone(true)}>
              Complete & Notify Bookkeeper
            </Button>
          </motion.div>
        )}
      </main>

      {/* Upload Modal Overlay */}
      <AnimatePresence>
        {activeItem && (
          <UploadModal 
            item={activeItem} 
            onClose={() => setActiveItem(null)} 
            onComplete={(fileName, note) => {
              updateItemStatus(activeItem.id, { 
                status: 'uploaded', 
                uploadedFileName: fileName, 
                clientNote: note,
                uploadedAt: new Date().toISOString()
              });
              setActiveItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-slate-200 text-center">
         <p className="text-xs text-slate-400">© 2026 DocNudge • Private client upload portal</p>
      </footer>
    </div>
  );
}

interface ItemCardProps {
  item: RequestItem;
  onUpload: () => void;
  onSkip: (reason: string) => void | Promise<void>;
  key?: React.Key;
}

function ItemCard({ item, onUpload, onSkip }: ItemCardProps) {
  const isCompleted = item.status === 'uploaded' || item.status === 'unavailable';

  return (
    <Card className={cn(
      'transition-all duration-200',
      isCompleted ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-200 shadow-md hover:shadow-lg'
    )}>
      <div className="p-5 flex items-start gap-4">
        {isCompleted ? (
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            item.status === 'uploaded' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
          )}>
            {item.status === 'uploaded' ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-5 h-5" />}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 font-bold border border-indigo-100">
            <Clock className="w-5 h-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={cn('text-lg font-bold leading-tight truncate', isCompleted ? 'text-slate-500' : 'text-slate-900')}>
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1">
             <p className="text-sm text-slate-500">
               {item.status === 'uploaded' ? `Uploaded: ${item.uploadedFileName}` : 
                item.status === 'unavailable' ? 'Marked as not available' : 
                'Action required'}
             </p>
             {!isCompleted && (
               <button 
                 onClick={(e) => { e.stopPropagation(); onSkip('User marked as unavailable'); }}
                 className="text-[11px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-wider"
               >
                 I don't have this
               </button>
             )}
          </div>
        </div>

        {!isCompleted && (
          <Button variant="primary" size="sm" className="rounded-lg px-4" onClick={onUpload}>
            Upload
          </Button>
        )}
      </div>
    </Card>
  );
}

function UploadModal({ item, onClose, onComplete }: { item: RequestItem; onClose: () => void; onComplete: (name: string, note: string) => void }) {
  const [note, setNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUnavailableMode, setIsUnavailableMode] = useState(false);

  const handleFakeUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      onComplete('document_capture_' + Math.floor(Math.random()*1000) + '.pdf', note);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold">Upload: {item.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        <div className="p-8 space-y-6">
          {!isUnavailableMode ? (
            <>
              <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all">
                 <input type="file" className="hidden" onChange={handleFakeUpload} />
                 <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                 <h4 className="font-bold text-slate-800">Tap to upload file</h4>
                 <p className="text-sm text-slate-500 mt-2">PDF, JPEG, or PNG supported</p>
              </label>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Note for bookkeeper (Optional)</label>
                 <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. This is for the second transaction..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                 />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                 <Button className="h-12 w-full font-bold" isLoading={isUploading} onClick={handleFakeUpload}>
                   Choose from Gallery/Files
                 </Button>
                 <Button variant="ghost" className="text-slate-400 text-xs" onClick={() => setIsUnavailableMode(true)}>
                    I don't have this document
                 </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-amber-50 p-4 rounded-xl flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-900">
                  Please let us know why this isn't available so we can record it.
                </p>
              </div>
              <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g. I never received an invoice for this. / Paid in cash, no receipt."
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
              />
              <div className="pt-4 flex gap-3">
                 <Button variant="secondary" className="flex-1" onClick={() => setIsUnavailableMode(false)}>Go back</Button>
                 <Button variant="danger" className="flex-1" onClick={() => onComplete('', note || 'User marked as unavailable')}>Mark Missing</Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SuccessState({ clientName }: { clientName: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
       <motion.div 
         initial={{ scale: 0.5, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="bg-emerald-100 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mb-8"
       >
         <CheckCircle2 className="w-12 h-12" />
       </motion.div>
       <h1 className="text-3xl font-extrabold mb-4 text-slate-900 underline decoration-indigo-200 underline-offset-8">All clear, {clientName}!</h1>
       <p className="text-xl text-slate-600 max-w-md mx-auto mb-10 leading-relaxed">
         Thank you. Your bookkeeper has been notified and can now review the documents you uploaded.
       </p>
       <p className="text-slate-400 text-sm italic">You can safely close this window now.</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium tracking-tight">Security Check — Preparing portal...</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-rose-100 text-rose-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <X className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Link Expired or Invalid</h1>
      <p className="text-slate-600 mb-8 max-w-sm">Please check with your bookkeeper to get a new document request link.</p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>Go to Home</Button>
    </div>
  );
}
