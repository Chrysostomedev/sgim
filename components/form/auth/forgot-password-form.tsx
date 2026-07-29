"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { authService } from "@/services/auth.service";

const schema = z.object({
    email: z.string().min(1, "Email requis").email("Format email invalide"),
});

type Values = z.infer<typeof schema>;

interface Props {
    onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
    });

    async function onSubmit(data: Values) {
        setIsLoading(true);

        toast.promise(
            authService.forgotPassword({ email: data.email }).finally(() => setIsLoading(false)),
            {
                loading: "Envoi du code en cours...",
                success: (res) => {
                    if (res.success) {
                        onSuccess(data.email);
                        return "Code OTP envoyé à votre adresse email.";
                    }
                    throw new Error(res.message ?? "Erreur lors de l'envoi.");
                },
                error: (err) =>
                    err?.message ?? err?.errorContent?.message ?? "Impossible d'envoyer le code.",
            }
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        placeholder="Votre adresse email"
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

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-capec-500 hover:bg-capec-600 text-white font-semibold"
                >
                    {isLoading
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi...</>
                        : "Envoyer le code"}
                </Button>
            </form>
        </Form>
    );
}
