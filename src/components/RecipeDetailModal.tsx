import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Share2, Camera, Clock, ChefHat, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: number;
  image: string;
  title: string;
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  servings: number;
  ingredients: string[];
  tools: string[];
  process: string[];
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailModal = ({ recipe, isOpen, onClose }: RecipeDetailModalProps) => {
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(recipe?.image || "");

  if (!recipe) return null;

  const handleDownload = () => {
    toast({
      title: "Recipe Downloaded",
      description: `${recipe.title} has been saved to your downloads.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this amazing ${recipe.title} recipe!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Recipe Link Copied",
        description: "Recipe link copied to clipboard!",
      });
    }
  };

  const handleChangeImage = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality will be available soon!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {recipe.title}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeImage}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Change Image
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recipe Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={currentImage}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Recipe Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">{recipe.prepTime}</p>
                <p className="text-xs text-muted-foreground">Prep Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <ChefHat className="h-4 w-4" />
                </div>
                <Badge variant={recipe.difficulty === "Easy" ? "secondary" : recipe.difficulty === "Medium" ? "default" : "destructive"}>
                  {recipe.difficulty}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Difficulty</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">{recipe.servings}</p>
                <p className="text-xs text-muted-foreground">Servings</p>
              </div>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="space-y-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Tools & Utensils */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tools & Utensils</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tools.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Macros */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Nutrition (per serving)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent/20 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{recipe.macros.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="text-center p-3 bg-accent/20 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{recipe.macros.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center p-3 bg-accent/20 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{recipe.macros.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center p-3 bg-accent/20 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{recipe.macros.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cooking Process */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Step-by-Step Process</h3>
          <div className="space-y-4">
            {recipe.process.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;