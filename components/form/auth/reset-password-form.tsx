"use client";

import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const schema = z
 .object({
    new_password: z
     .string()
     .min(8, "Au moins 8 caractères")
     .regex(PWD_REGEX, "Doit contenir majuscule, minuscule, chiffre et caractère spécial"),
    confirm: z.string().min(1, "Confirmez le mot de passe"),
  })
 .refine((d) => d.new_password === d.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

interface Props {
  email?: string;
  resetToken?: string;
}

export function ResetPasswordForm({ email, resetToken }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: "", confirm: "" },
  });

  function onSubmit(data: Values) {
    setIsLoading(true);
    console.log("[STATIC] reset password", { email, resetToken, data });

    // Simule une réinitialisation statique
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  }

  const ToggleBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      tabIndex={-1}
      onClick={toggle}
      className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show? <EyeOff className="h- w-" /> : <Eye className="h- w-" />}
    </button>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute top-1/2 -translate-y-1/2 left-4 h- w- text-gray-400 pointer-events-none" />
                  <Input
                    type={showNew? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    className="h-12 pl-11 pr-12"
                    disabled={isLoading}
                    {...field}
                  />
                  <ToggleBtn show={showNew} toggle={() => setShowNew(!showNew)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute top-1/2 -translate-y-1/2 left-4 h- w- text-gray-400 pointer-events-none" />
                  <Input
                    type={showConf? "text" : "password"}
                    placeholder="Confirmer"
                    className="h-12 pl-11 pr-12"
                    disabled={isLoading}
                    {...field}
                  />
                  <ToggleBtn show={showConf} toggle={() => setShowConf(!showConf)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs text-gray-500">
          8 caractères minimum — une majuscule, une minuscule, un chiffre et un caractère spécial
          (@$!%*?&).
        </p>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#0FB5B1] hover:bg-[#0e8a87] text-white font-semibold"
        >
          {isLoading? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Réinitialisation...
            </>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </Button>
      </form>
    </Form>
  );
}