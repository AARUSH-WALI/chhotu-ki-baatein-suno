import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import cooksyLogo from "@/assets/cooksy-logo.png";

const Success = () => {
  const navigate = useNavigate();

  const handleStartCooking = () => {
    // Navigate to main dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo at top */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-3">
            <img 
              src={cooksyLogo} 
              alt="Cooksy Logo" 
              className="h-12 w-12 rounded-lg shadow-card"
            />
            <h1 className="text-2xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
              Cooksy
            </h1>
          </div>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary/30 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            Profile Created Successfully! 
            <span className="text-2xl">🎉</span>
          </h2>
          <p className="text-muted-foreground">
            Your personalized cooking experience is ready!
          </p>
        </div>

        {/* Start Cooking Button */}
        <Button 
          variant="hero" 
          size="lg"
          onClick={handleStartCooking}
          className="px-8 py-3 text-lg animate-fade-in"
        >
          Let's start Cooking!
        </Button>

        {/* Decorative elements */}
        <div className="mt-12 opacity-30">
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;