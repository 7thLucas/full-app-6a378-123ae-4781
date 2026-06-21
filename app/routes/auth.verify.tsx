import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { Form, Link, useActionData, useNavigation } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const jwtPayload = getUserFromRequest(request);
  if (!jwtPayload) return redirect("/auth/login");
  const formData = await request.formData();
  const action = String(formData.get("_action") ?? "");

  try {
    if (action === "send") {
      const res = await fetch(`${process.env.APP_URL ?? "http://localhost:3000"}/api/auth/send-verification`, {
        method: "POST",
        headers: { Cookie: request.headers.get("Cookie") ?? "" },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Failed to send code");
      return { success: true, message: "Verification code sent to your email." };
    } else if (action === "verify") {
      const code = String(formData.get("code") ?? "");
      const res = await fetch(`${process.env.APP_URL ?? "http://localhost:3000"}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") ?? "",
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Verification failed");
      return redirect("/");
    }
  } catch (error: any) {
    return { error: error.message };
  }
  return null;
}

interface ActionData {
  error?: string;
  success?: boolean;
  message?: string;
}

export default function VerifyEmailPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          We'll send a verification code to your email address.
        </p>

        {actionData?.success && actionData.message && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400 mb-4">
            {actionData.message}
          </div>
        )}
        {actionData?.error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <input
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="w-full h-14 bg-muted rounded-xl px-4 text-center text-2xl font-bold tracking-widest text-foreground outline-none focus:ring-2 focus:ring-ring border border-border"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              name="_action"
              value="send"
              className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Send code
            </button>
            <button
              type="submit"
              name="_action"
              value="verify"
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              Verify
            </button>
          </div>
        </Form>

        <div className="mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Skip for now →
          </Link>
        </div>
      </div>
    </div>
  );
}
