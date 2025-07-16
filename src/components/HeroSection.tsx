import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight, ChefHat, Clock } from "lucide-react";
import cooksyLogo from "@/assets/cooksy-logo.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-warm overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Logo and Brand Name */}
          <div className="flex flex-col items-center mb-8 animate-fade-in">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={cooksyLogo} 
                alt="Cooksy Logo" 
                className="h-20 w-20 rounded-2xl shadow-warm animate-glow-pulse"
              />
              <h1 className="text-6xl md:text-7xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
                Cooksy
              </h1>
            </div>
            
            {/* Tagline */}
            <div className="max-w-4xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Recipes that wait for you —{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  not the other way around
                </span>
              </h2>
            </div>
          </div>

          {/* Quote - Left aligned but centered in container */}
          <div className="max-w-3xl mx-auto mb-12 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-left">
              <blockquote className="text-xl md:text-2xl text-muted-foreground italic font-medium border-l-4 border-primary pl-6">
                "Cooking is therapy. And your assistant is always here for you."
              </blockquote>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <Link to="/signup">
                <Mic className="mr-2 h-5 w-5" />
                Start Cooking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-4">
              <ChefHat className="mr-2 h-5 w-5" />
              Explore Recipes
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="flex items-center justify-center space-x-12 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-primary" />
              <span className="text-sm">Voice Guided</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm">Adaptive Timing</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <span className="text-sm">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </section>
  );
}