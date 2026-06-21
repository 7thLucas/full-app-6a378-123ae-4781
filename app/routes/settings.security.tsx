import { useState } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Shield, Smartphone, Bell, Eye } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function SecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Password & Security</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Security status */}
        <div
          className="rounded-2xl p-4 border border-border"
          style={{ background: "linear-gradient(135deg, #7C3AED10 0%, #4F46E510 100%)" }}
        >
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-primary" />
            <div>
              <p className="font-semibold text-foreground text-sm">Security Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {twoFAEnabled ? "Strong — 2FA is enabled" : "Moderate — Consider enabling 2FA"}
              </p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            Password
          </h3>
          <Link
            to="/auth/forgot-password"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">Change password</span>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
        </div>

        {/* Two Factor Auth */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            Two-Factor Authentication
          </h3>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">2FA via email OTP</p>
                <p className="text-xs text-muted-foreground">Require a code to sign in</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFAEnabled(v => !v)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                twoFAEnabled ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", twoFAEnabled ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>
        </div>

        {/* Login alerts */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            Login Alerts
          </h3>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">New device alert</p>
                <p className="text-xs text-muted-foreground">Notify when signed in from new device</p>
              </div>
            </div>
            <button
              onClick={() => setLoginAlerts(v => !v)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                loginAlerts ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", loginAlerts ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>
        </div>

        {/* AI Protection */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            AI Protection
          </h3>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Eye size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">AI fake account detection</p>
              <p className="text-xs text-muted-foreground">Our AI actively monitors for suspicious activity on your account</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-green-500">Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}
