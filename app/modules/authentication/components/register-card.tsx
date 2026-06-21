import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";

interface ActionData {
  error?: string;
}

export function RegisterCard() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={config?.appName ?? "Lumora"} className="h-12 w-auto mx-auto mb-3 object-contain" />
          ) : (
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {config?.appName ?? "Lumora"}
            </h1>
          )}
          <p className="text-muted-foreground text-sm">{config?.onboardingSubtext ?? "Share moments. Discover creators. Build your story."}</p>
        </div>

        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {actionData.error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-foreground">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="yourhandle"
              required
              autoComplete="username"
              className="w-full h-12 bg-muted rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring border border-border"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full h-12 bg-muted rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring border border-border"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full h-12 bg-muted rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring border border-border"
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary">Terms of Service</a> and{" "}
            <a href="#" className="text-primary">Privacy Policy</a>.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl font-semibold text-sm text-primary-foreground disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Creating account...
              </span>
            ) : "Create account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-semibold hover:opacity-70">
              Sign in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
