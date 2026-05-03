import { cn } from '../../lib/utils';
import { RequestStatus } from '../../types';

export const StatusBadge = ({ status }: { status: RequestStatus | 'active' | 'completed' | 'archived' }) => {
  const styles: Record<string, string> = {
    missing: 'bg-amber-50 text-amber-700 border-amber-200',
    uploaded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    unavailable: 'bg-slate-100 text-slate-600 border-slate-200',
    needs_review: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    active: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const labels: Record<string, string> = {
    missing: 'Missing',
    uploaded: 'Uploaded',
    unavailable: 'Unavailable',
    needs_review: 'Needs Review',
    active: 'Active',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
      styles[status] || styles.missing
    )}>
      {labels[status] || status}
    </span>
  );
};
