import { useState } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

const REPORT_TYPES = [
  { value: "spam", label: "Spam or fake account" },
  { value: "fake_account", label: "Fake account / impersonation" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "other", label: "Something else" },
];

export default function ReportPage() {
  const [type, setType] = useState("spam");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/social/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Failed to submit report");
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle size={48} className="text-primary mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Report submitted</h2>
        <p className="text-muted-foreground text-sm mb-6">Thank you for helping keep Lumora safe. We'll review your report shortly.</p>
        <Link to="/settings" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm">
          Back to Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center justify-between h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Report a Problem</h1>
        <div />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground mb-6">
          Help us keep Lumora safe. Let us know what's going on.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-2">What's happening?</label>
          <div className="space-y-2">
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.value}
                onClick={() => setType(rt.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors",
                  type === rt.value ? "border-primary bg-primary/5 text-foreground" : "border-border text-foreground hover:border-primary/40"
                )}
              >
                <div className={cn("w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors", type === rt.value ? "border-primary bg-primary" : "border-muted-foreground")} />
                <span className="text-sm">{rt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">Additional details (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the problem in more detail..."
            rows={4}
            className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </main>
    </div>
  );
}
