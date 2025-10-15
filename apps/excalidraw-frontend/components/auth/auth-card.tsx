"use client";

import type React from "react";
import { Spinner } from "@/components/ui/spinner"; // show spinner during submit

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";
import { BACKEND_URL } from "@repo/backend-common/config";
import { redirect } from "next/navigation";

type Variant = "login" | "signup";

export function AuthCard({
  variant = "login",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const isLogin = variant === "login";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    let username;
    let password;
    let firstName;
    let lastName;
    // console.log(isLogin)
    if (
      usernameRef.current?.value == null ||
      fnameRef == null ||
      lnameRef == null ||
      passwordRef == null
    ) {
      alert("Please fill all inputs");
    }else{
      username = usernameRef.current.value;
       firstName = fnameRef.current?.value;
       lastName = lnameRef.current?.value;
       password = passwordRef.current?.value;
    }
    if(isLogin){
      try {
        const res = await axios.post(`${BACKEND_URL}/signin`,{
          username: username,
          password: password        
        })

        if (res.status===500){
          setLoading(false);
        
        }
      } catch (error) {
        
      }
    } else{
      try {
        
      } catch (error) {
        
      }

    }
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
          <div className="grid gap-2">
         <Label htmlFor="name">Username</Label>
              <Input
                id="username"
                name="name"
                placeholder="username"
                autoComplete="name"
                ref={usernameRef}
                />
              </div>
                {!isLogin && (
                  <div className="grid gap-2">
                    
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="fname"
                      name="firstname"
                      placeholder="Your First name"
                      autoComplete="name"
                    />
                    <Label htmlFor="name">Last Name</Label>
                    <Input
                      id="lname"
                      name="lname"
                      placeholder="Your Last name if any else a space"
                      autoComplete="name"
                    />
                  </div>
                )}
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
                href="/signin"
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
