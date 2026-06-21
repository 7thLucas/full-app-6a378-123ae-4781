import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";

interface ActionData {
  error?: string;
}

export function LoginCard() {
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
              className="text-4xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {config?.appName ?? "Lumora"}
            </h1>
          )}
          <p className="text-muted-foreground text-sm">{config?.tagline ?? "Your world, beautifully connected."}</p>
        </div>

        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {actionData.error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full h-12 bg-muted rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring border border-border transition-shadow"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <Link to="/auth/forgot-password" className="text-xs text-primary font-medium hover:opacity-70">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full h-12 bg-muted rounded-xl px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring border border-border transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl font-semibold text-sm text-primary-foreground disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing in...
              </span>
            ) : "Sign in"}
          </button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-primary font-semibold hover:opacity-70">
              Sign up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
