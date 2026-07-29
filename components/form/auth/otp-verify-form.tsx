"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

const OTP_LEN       = 6;
const RESEND_DELAY  = 60;

interface Props {
    email:     string;
    onSuccess: (resetToken: string) => void;
    onBack:    () => void;
}

export function OtpVerifyForm({ email, onSuccess, onBack }: Props) {
    const [digits,     setDigits]     = useState<string[]>(Array(OTP_LEN).fill(""));
    const [isLoading,  setIsLoading]  = useState(false);
    const [isResending,setIsResending]= useState(false);
    const [cooldown,   setCooldown]   = useState(RESEND_DELAY);
    const [error,      setError]      = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

    // Countdown
    useEffect(() => {
        if (cooldown <= 0) return;
        timerRef.current = setInterval(() => {
            setCooldown((p) => {
                if (p <= 1) { clearInterval(timerRef.current!); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [cooldown]);

    function handleChange(i: number, val: string) {
        if (!/^\d*$/.test(val)) return;
        const next = [...digits];
        next[i] = val.slice(-1);
        setDigits(next);
        setError(null);
        if (val && i < OTP_LEN - 1) inputRefs.current[i + 1]?.focus();
    }

    function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !digits[i] && i > 0) {
            inputRefs.current[i - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
        const next   = Array(OTP_LEN).fill("");
        pasted.split("").forEach((d, i) => (next[i] = d));
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, OTP_LEN - 1)]?.focus();
    }

    async function handleVerify() {
        const otp = digits.join("");
        if (otp.length < OTP_LEN) {
            setError(`Entrez les ${OTP_LEN} chiffres du code.`);
            return;
        }

        setIsLoading(true);
        toast.promise(
            authService.verifyOtp({ email, otp }).finally(() => setIsLoading(false)),
            {
                loading: "Vérification...",
                success: (res) => {
                    if (res.success && res.data?.reset_token) {
                        onSuccess(res.data.reset_token);
                        return "Code vérifié avec succès.";
                    }
                    throw new Error(res.message ?? "Code invalide.");
                },
                error: (err) => {
                    setError(err?.message ?? "Code invalide ou expiré.");
                    return err?.message ?? "Code invalide ou expiré.";
                },
            }
        );
    }

    async function handleResend() {
        if (cooldown > 0 || isResending) return;
        setIsResending(true);
        toast.promise(
            authService.forgotPassword({ email }).finally(() => setIsResending(false)),
            {
                loading: "Renvoi du code...",
                success: (res) => {
                    if (res.success) {
                        setDigits(Array(OTP_LEN).fill(""));
                        setCooldown(RESEND_DELAY);
                        return "Nouveau code envoyé.";
                    }
                    throw new Error(res.message);
                },
                error: (err) => err?.message ?? "Impossible de renvoyer le code.",
            }
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-center text-sm text-gray-600">
                Code à {OTP_LEN} chiffres envoyé à{" "}
                <span className="font-medium text-gray-900">{email}</span>
            </p>

            {/* OTP inputs */}
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                {Array.from({ length: OTP_LEN }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digits[i]}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        disabled={isLoading}
                        className="h-12 w-12 rounded-xl border border-gray-300 bg-white text-center text-xl font-bold text-gray-900 outline-none transition focus:border-capec-500 focus:ring-2 focus:ring-capec-500/20 disabled:opacity-50"
                    />
                ))}
            </div>

            {error && (
                <p className="text-center text-xs font-medium text-red-500">{error}</p>
            )}

            <Button
                type="button"
                disabled={isLoading || digits.join("").length < OTP_LEN}
                onClick={handleVerify}
                className="w-full h-12 rounded-xl bg-capec-500 hover:bg-capec-600 text-white font-semibold"
            >
                {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Vérification...</>
                    : "Vérifier le code"}
            </Button>

            <div className="flex flex-col items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending}
                    className="flex items-center gap-1.5 text-capec-600 hover:text-capec-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    {cooldown > 0 ? `Renvoyer (${cooldown}s)` : "Renvoyer le code"}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
                >
                    Modifier l'adresse email
                </button>
            </div>
        </div>
    );
}
