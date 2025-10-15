"use client";

import type React from "react";
import { Spinner } from "@/components/ui/spinner"; // show spinner during submit

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Variant = "login" | "signup";

export function AuthCard({
  variant = "login",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const isLogin = variant === "login";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Replace with your existing auth logic. This is purely presentational.
    setTimeout(() => setLoading(false), 600);
  }

  return (
    <Card
      className={cn(
        "mx-auto w-full max-w-sm anim-fade-up focus-within:ring-1 focus-within:ring-ring/30 hover-lift",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-center text-lg font-medium">
          {isLogin ? "Welcome back" : "Create your account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="btn-press hover-lift transition-all hover:shadow-xs active:scale-[0.98]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Please wait…
              </span>
            ) : isLogin ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              New here?{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-primary"
                href="/signup"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-primary"
                href="/login"
              >
                Log in
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
