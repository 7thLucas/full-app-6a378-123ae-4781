import { useState } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Upload, BadgeCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function VerificationPage() {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    setIdPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!idFile) { setError("Please upload a government ID."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", idFile);
      const uploadRes = await fetch("/api/uploader/document", { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Failed to upload ID");

      const res = await fetch("/api/social/verify/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ governmentIdUrl: uploadData.data.url, reason }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Request failed");
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
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #7C3AED20 0%, #4F46E520 100%)" }}
        >
          <CheckCircle size={36} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Request submitted!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Our team will review your identity documents and respond within 3-5 business days.
        </p>
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
        <h1 className="font-semibold text-foreground">Request Verification</h1>
        <div />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)" }}
          >
            <BadgeCheck size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Get Verified</h2>
          <p className="text-muted-foreground text-sm">
            A verified badge shows that your account is authentic. To get verified, upload a valid government-issued ID.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-muted rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            Requirements
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              Your account must represent a real person, business, or organization
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              Your account must be notable and authentic
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              Your account must comply with our terms and community guidelines
            </li>
          </ul>
        </div>

        {/* Government ID upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">Government ID (required)</label>
          {!idPreview ? (
            <label className="block w-full border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Upload size={28} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Upload passport, driver's license, or national ID</p>
              <p className="text-xs text-muted-foreground mt-1">Accepted: JPG, PNG, PDF</p>
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative">
              <img src={idPreview} alt="ID preview" className="w-full rounded-2xl object-cover max-h-48" />
              <button
                onClick={() => { setIdFile(null); setIdPreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">Why should you be verified? (optional)</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Explain why your account should be verified..."
            rows={3}
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
          disabled={submitting || !idFile}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          style={{ background: !submitting && idFile ? "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" : undefined }}
        >
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By submitting, you agree to our Terms of Service and Privacy Policy. Your ID will be securely handled and not shared publicly.
        </p>
      </main>
    </div>
  );
}
