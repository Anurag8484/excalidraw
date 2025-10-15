import { AuthCard } from "@/components/auth/auth-card";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Pencil } from "lucide-react";

export default function SignupPage() {
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
      <div className="grid flex-1 place-items-center px-4 py-10 anim-fade-in">
        <AuthCard variant="signup" />
      </div>
    </main>
  );
}
