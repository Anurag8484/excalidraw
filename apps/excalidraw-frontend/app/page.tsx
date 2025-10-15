'use client'
// import { Button } from "@repo/ui/button";
import { Button } from "@/components/ui/button";
import { Pencil, Users, Zap, Download, Share2, Layers } from "lucide-react";
import { redirect } from "next/navigation";
export default function Home() {

  function redToSignin(){
    redirect('/signin')
  }
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="w-6 h-6" />
            <span className="font-bold text-xl">Sketchboard</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-sm hover:text-foreground/80 transition-colors"
            >
              Features
            </a>
            <a
              className="text-sm hover:text-foreground/80 transition-colors"
            >
              Examples
            </a>
            <a
              className="text-sm hover:text-foreground/80 transition-colors"
            >
              Pricing
            </a>
            <a
              className="text-sm hover:text-foreground/80 transition-colors"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try for free
            </Button>
            <Button className="" onClick={()=>{redToSignin()}} >
              Getting started
            </Button>
            <Button className="" onClick={()=>{redToSignin()}} >
              Log in
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm mb-8">
            <span className="font-semibold">New:</span>
            <span className="text-muted-foreground">Infinite Canvas</span>
            <a href="#" className="text-accent hover:underline">
              Learn more
            </a>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Sketch ideas together in real-time
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            A collaborative whiteboard tool that feels like drawing on paper.
            Perfect for brainstorming, wireframing, and visual thinking.
          </p>

          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full"
          >
            Start drawing for free
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            Over 50,000 teams use Sketchboard to bring ideas to life
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 opacity-60">
            <div className="text-2xl font-bold">Google</div>
            <div className="text-2xl font-bold">Microsoft</div>
            <div className="text-2xl font-bold">Spotify</div>
            <div className="text-2xl font-bold">Airbnb</div>
            <div className="text-2xl font-bold">Stripe</div>
            <div className="text-2xl font-bold">Netflix</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Everything you need to visualize ideas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Simple tools that feel natural, with powerful features for teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Pencil className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Hand-drawn feel</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sketchy, hand-drawn style that makes diagrams feel approachable
              and encourages creativity
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Real-time collaboration
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Work together seamlessly with live cursors, comments, and instant
              updates for your team
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built for speed with an infinite canvas that handles thousands of
              elements smoothly
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Export anywhere</h3>
            <p className="text-muted-foreground leading-relaxed">
              Export to PNG, SVG, or clipboard. Embed in Notion, Confluence, and
              more
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy sharing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share with a link, control permissions, and collaborate with
              anyone, anywhere
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rich library</h3>
            <p className="text-muted-foreground leading-relaxed">
              Shapes, arrows, text, images, and more. Everything you need to
              express your ideas
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Start sketching in seconds
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 text-pretty">
            No sign-up required. Jump right in and start creating beautiful
            diagrams
          </p>
          <Button
            className="text-lg px-8 py-6 rounded-full"
          >
            Try Sketchboard for free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pencil className="w-5 h-5" />
                <span className="font-bold">Sketchboard</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The collaborative whiteboard for visual thinkers
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Sketchboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
