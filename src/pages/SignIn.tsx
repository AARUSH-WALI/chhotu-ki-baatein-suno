import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import cooksyLogo from "@/assets/cooksy-logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate signin process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to dashboard after successful signin
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background/95 backdrop-blur-sm rounded-lg shadow-elegant border border-border/50 p-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={cooksyLogo} 
            alt="Cooksy Logo" 
            className="h-12 w-12 rounded-lg shadow-card mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
            Cooksy
          </h1>
          <h2 className="text-xl font-semibold text-foreground mt-4">
            Sign in to your account
          </h2>
        </div>

        {/* Google Sign In Button */}
        <Button 
          variant="outline" 
          className="w-full mb-6 border-border/50 hover:bg-accent/50"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>

        <div className="text-center text-muted-foreground mb-6">
          or continue with email
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Password forgotten?
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Do not have an account yet?{" "}
          <Link 
            to="/signup" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;