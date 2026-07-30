"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().min(1, "Email requis").email("Format email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setIsLoading(true);
    console.log("[STATIC] login", values);

    // Simule connexion statique
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 800);
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
                    <Mail className="absolute top-1/2 -translate-y-1/2 left-4 h- w- text-gray-400 pointer-events-none" />
                    <Input type="email" placeholder="Email" className="h-12 pl-11" disabled={isLoading} {...field} />
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
                    <Key className="absolute top-1/2 -translate-y-1/2 left-4 h- w- text-gray-400 pointer-events-none" />
                    <Input
                      type={showPw? "text" : "password"}
                      placeholder="Mot de passe"
                      className="h-12 pl-11 pr-12"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPw((v) =>!v)}
                    >
                      {showPw? <EyeOff className="h- w-" /> : <Eye className="h- w-" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link href="/mot-de-passe-oublie" className="text-sm text-gray-500 hover:text-[#0FB5B1] transition-colors">
              Mot de passe oublié?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#0FB5B1] hover:bg-[#0e8a87] text-white font-semibold text-base shadow-sm"
          >
            {isLoading? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}