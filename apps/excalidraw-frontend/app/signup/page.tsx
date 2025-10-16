'use client'
import { AuthCard } from "@/components/auth/auth-card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function SignupPage() {
    const [errorMsg,setErrorMsg] = useState<string|null>(null);
  
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex h-14 items-center justify-between border-b bg-background/70 backdrop-blur px-4 supports-[backdrop-filter]:bg-background/50">
        <Link href="/" aria-label="Home">
          <div className="flex items-center gap-2">
            <Pencil className="w-6 h-6" />
            <span className="font-bold text-xl">Sketchboard</span>
          </div>
        </Link>
        <Link
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          href="/signin"
        >
          Log in
        </Link>
      </div>
      <div className="translate-y-40 flex justify-center ">
        {errorMsg ? (
          <Alert
            variant="destructive"
            className=" flex justify-center items-center w-fit"
          >
            <AlertTitle>Please ensure you input valid details</AlertTitle>
            {/* <AlertDescription>
          
          </AlertDescription> */}
          </Alert>
        ) : (
          ""
        )}
      </div>
      <div className="grid flex-1 place-items-center px-4 py-10 anim-fade-in">
        <AuthCard
          setErrorMsg={setErrorMsg}
          errorMsg={errorMsg}
          variant="signup"
        />
      </div>
     
    </main>
  );
}
