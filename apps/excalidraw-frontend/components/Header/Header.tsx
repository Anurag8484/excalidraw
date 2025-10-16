'use client'
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

export default function Header(){
      function redToSignin() {
        redirect("/signin");
      }
    return (
      <header className="border-b border-border">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="w-6 h-6" />
            <span className="font-bold text-xl">Sketchboard</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm hover:text-foreground/80 transition-colors">
              Features
            </a>
            <a className="text-sm hover:text-foreground/80 transition-colors">
              Examples
            </a>
            <a className="text-sm hover:text-foreground/80 transition-colors">
              Pricing
            </a>
            <a className="text-sm hover:text-foreground/80 transition-colors">
              Docs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Try for free
            </Button>
            <Button
              className=""
              onClick={() => {
                redToSignin();
              }}
            >
              Getting started
            </Button>
            <Button
              className=""
              onClick={() => {
                redToSignin();
              }}
            >
              Log in
            </Button>
          </div>
        </nav>
      </header>
    );
}