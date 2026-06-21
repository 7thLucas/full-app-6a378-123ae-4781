import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, BadgeCheck, FileText } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function IdentityPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Identity Documents</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #7C3AED10 0%, #4F46E510 100%)" }}
          >
            <FileText size={28} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Identity Verification</h2>
          <p className="text-muted-foreground text-sm">
            Lumora uses government-issued ID verification for creator and public accounts to ensure authenticity.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <BadgeCheck size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Government ID Verification</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upload passport, driver's license, or national ID</p>
            </div>
            <Link to="/settings/verify" className="ml-auto text-primary text-sm font-semibold flex-shrink-0">
              Upload →
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-muted rounded-2xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your identity documents are encrypted and securely stored. They are used only for verification purposes and are never shared publicly. By submitting, you agree to our Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
}
