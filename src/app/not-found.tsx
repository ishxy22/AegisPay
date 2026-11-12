import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
      <p className="text-xs text-muted-foreground max-w-sm">
        The requested digital record, milestone, or dispute route could not be located in the AegisPay ledger.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

