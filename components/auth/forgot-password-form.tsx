"use client";

import { useRef, useState, type FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/validation/auth";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const client = useRef<SupabaseClient | null>(null);
  const busy = useRef(false);
  const [step, setStep] = useState<"email" | "code" | "password" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recovery credentials stay in memory, separate from the site's login session.
  function recoveryClient() {
    if (!client.current) {
      client.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
      );
    }
    return client.current;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(null);
    try {
      const supabase = recoveryClient();
      if (step === "email") {
        const normalized = email.trim();
        if (!signInSchema.shape.email.safeParse(normalized).success) {
          setError("Enter a valid email address.");
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(normalized);
        if (error) {
          setError(error.status === 429
            ? "Too many email requests. Please wait before trying again."
            : "Could not send a recovery email. Please try again later.");
          return;
        }
        setEmail(normalized);
        setStep("code");
      } else if (step === "code") {
        const token = code.trim();
        if (!/^\d{6,10}$/.test(token)) {
          setError("Enter the numeric code from your email.");
          return;
        }
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "recovery" });
        if (error || !data.session) {
          setError("The code is incorrect or expired. Try again or request a new code.");
          return;
        }
        setCode("");
        setStep("password");
      } else if (step === "password") {
        const parsed = signInSchema.shape.password.safeParse(password);
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        if (password !== confirmation) {
          setError("Passwords do not match.");
          return;
        }
        // Supabase authorizes this update with the session issued after OTP verification.
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setError("Could not update your password. Your session may have expired, or the password may not meet requirements. Request a new code if needed.");
          return;
        }
        setPassword("");
        setConfirmation("");
        await supabase.auth.signOut({ scope: "local" });
        client.current = null;
        setStep("done");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  function restart() {
    client.current = null;
    setCode("");
    setPassword("");
    setConfirmation("");
    setError(null);
    setStep("email");
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl">Reset your password</h2>
      {step === "done" ? (
        <p role="status">Your password has been updated. Sign in with your new password.</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-5">
          {step === "email" && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Enter your account email to request a verification code.</p>
              <Label htmlFor="recovery-email">Email</Label>
              <Input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
          )}
          {step === "code" && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">If an account exists for {email}, a recovery code has been sent. Check your inbox and spam folder.</p>
              <Label htmlFor="recovery-code">Verification code</Label>
              <Input id="recovery-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" minLength={6} maxLength={10} required value={code} onChange={(e) => setCode(e.target.value)} disabled={loading} />
            </div>
          )}
          {step === "password" && (
            <>
              <p className="text-sm text-muted-foreground">Email verified. Choose your new password.</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="recovery-password">New password</Label>
                <Input id="recovery-password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="recovery-confirmation">Confirm new password</Label>
                <Input id="recovery-confirmation" type="password" autoComplete="new-password" minLength={6} required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} disabled={loading} />
              </div>
            </>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="rounded-none" disabled={loading}>
            {loading ? "Please wait..." : step === "email" ? "Send verification code" : step === "code" ? "Verify code" : "Update password"}
          </Button>
          {(step === "code" || step === "password") && (
            <Button type="button" variant="ghost" disabled={loading} onClick={restart}>Request a new code</Button>
          )}
        </form>
      )}
      <Button type="button" variant="ghost" disabled={loading} onClick={onBack}>Back to sign in</Button>
    </div>
  );
}
