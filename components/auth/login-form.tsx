"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { signIn, signUp } from "@/actions/auth";
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from "@/lib/validation/auth";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSignIn(values: SignInInput) {
    setLoading(true);
    setError(null);
    const result = await signIn(values);
    setLoading(false);
    if (!result.ok) return setError(result.message ?? "Could not sign in.");
    router.push(redirectTo);
    router.refresh();
  }

  async function onSignUp(values: SignUpInput) {
    setLoading(true);
    setError(null);
    const result = await signUp(values);
    setLoading(false);
    if (!result.ok) return setError(result.message ?? "Could not create account.");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Tabs defaultValue="sign-in" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-transparent">
        <TabsTrigger value="sign-in" className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="sign-up" className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none">
          Create Account
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sign-in" className="mt-8">
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="flex flex-col gap-5">
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="rounded-none" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="sign-up" className="mt-8">
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="flex flex-col gap-5">
            <FormField
              control={signUpForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="rounded-none" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
