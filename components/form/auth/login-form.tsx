"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button }       from "@/components/ui/button";
import { Input }        from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { cookieFunctions } from "@/lib/cookies";
import { ROUTES }          from "@/lib/routes";
import { authService }     from "@/services/auth.service";
import { getFCMToken }     from "@/lib/firebase";

const schema = z.object({
    email:    z.string().min(1, "Email requis").email("Format email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
    const router      = useRouter();
    const [showPw,    setShowPw]    = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Pré-charge le FCM token en arrière-plan dès le montage
    // Ne bloque JAMAIS le login même si ça échoue
    const fcmTokenRef = useRef<string>("");
    useEffect(() => {
        getFCMToken()
            .then(t => { if (t) fcmTokenRef.current = t; })
            .catch(() => {});
    }, []);

    const form = useForm<LoginValues>({
        resolver:      zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: LoginValues) {
        setIsLoading(true);
        try {
            // Payload — on inclut fcm_token seulement s'il est disponible
            const payload: any = { ...values };
            if (fcmTokenRef.current) payload.fcm_token = fcmTokenRef.current;

            const response = await authService.login(payload);

            if (!response?.success) {
                toast.error(response?.message ?? "Identifiants incorrects.");
                return;
            }

            const data  = response?.data ?? response;
            const token = data?.token ?? data?.access_token ?? response?.access_token;
            const user  = data?.user  ?? response?.user;

            if (!token) {
                toast.error("Token absent dans la réponse du serveur.");
                return;
            }

            cookieFunctions.setToken(token);
            cookieFunctions.setUser(user);

            const first = user?.first_name ?? "";
            const last  = user?.last_name  ?? "";
            toast.success(`Bienvenue, ${[first, last].filter(Boolean).join(" ")}`);

            const role = cookieFunctions.getUserRole();
            const dest = role === "DOCTOR" ? ROUTES.DOCTOR.DASHBOARD : ROUTES.ADMIN.DASHBOARD;
            router.push(dest);

        } catch (err: any) {
            const msg =
                err?.errorMessage ??
                err?.errorContent?.message ??
                err?.message ??
                "Identifiants incorrects.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 -translate-y-1/2 left-4 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="h-12 pl-11"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mot de passe */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Key className="absolute top-1/2 -translate-y-1/2 left-4 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                                        <Input
                                            type={showPw ? "text" : "password"}
                                            placeholder="Mot de passe"
                                            className="h-12 pl-11 pr-12"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            onClick={() => setShowPw(v => !v)}
                                        >
                                            {showPw
                                                ? <EyeOff className="h-[18px] w-[18px]" />
                                                : <Eye    className="h-[18px] w-[18px]" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mot de passe oublié */}
                    <div className="flex justify-end">
                        <Link
                            href={ROUTES.AUTH.FORGOT_PASSWORD}
                            className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-[#f97316] hover:bg-orange-600 text-white font-semibold text-base shadow-sm"
                    >
                        {isLoading
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connexion...</>
                            : "Se connecter"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
