import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cooksyLogo from "@/assets/cooksy-logo.png";

export function Header() {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src={cooksyLogo} 
              alt="Cooksy Logo" 
              className="h-10 w-10 rounded-lg shadow-card"
            />
            <h1 className="text-2xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
              Cooksy
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Recipes
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}