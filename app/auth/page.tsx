"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Sparkles } from "lucide-react";

type Mode = "login" | "signup";
type Role = "farmer" | "consumer" | "provider";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [role, setRole] = useState<Role>("farmer");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [village, setVillage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body =
        mode === "signup"
          ? { phone, password, fullName, role, village, consentShareWithJudges: consent }
          : { phone, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "phone_already_registered") {
          setError("That phone number is already registered. Try logging in instead.");
        } else if (data.error === "invalid_credentials") {
          setError("Incorrect phone number or password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      router.push("/marketplace");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-farm-green text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold text-gray-900">Jeevadhara</span>
        </div>

        <div className="mt-6 flex rounded-lg border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-farm-green text-white" : "text-gray-500"
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-farm-green text-white" : "text-gray-500"
            }`}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">I am a</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["farmer", "consumer", "provider"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-lg border py-2 text-sm font-medium capitalize transition ${
                        role === r
                          ? "border-farm-green bg-green-50 text-farm-green"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Village (optional)</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
                  placeholder="e.g. Solipeta"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none focus:ring-1 focus:ring-farm-green"
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            />
          </div>

          {mode === "signup" && (
            <label className="flex items-start gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5"
              />
              I agree that my feedback and usage may be shared with Build with Gemini XPRIZE
              judges as part of the hackathon submission.
            </label>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-farm-green py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        {mode === "signup" && role === "farmer" && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
            <Sparkles className="h-3.5 w-3.5" />
            Once you're in, the price and listing agents help you list your first product.
          </p>
        )}
      </div>
    </div>
  );
}
