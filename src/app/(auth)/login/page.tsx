"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { apiClient } from "@/lib/api/client";
import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/auth.schema";
import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormMessage as StatusMessage } from "@/components/forms/form-message";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", data);

    if (!response.success) {
      toast.error(response.error.message);
      return;
    }

    setUser(response.data.user);
    toast.success("Welcome back!");

    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your {siteConfig.name} account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <StatusMessage
                message={form.formState.errors.root.message}
                type="error"
              />
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={siteConfig.links.register}
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
