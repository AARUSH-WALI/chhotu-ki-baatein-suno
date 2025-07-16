import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const Allergies = () => {
  const navigate = useNavigate();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const allergyOptions = [
    "Agar", "Ajinomoto", "All Purpose Flour", "Almond Milk", "Almonds", "Alum", "Amaranth",
    "Anchovies", "Artificial Colors", "Artificial Flavors", "Aspartame", "Avocado",
    "Barley", "Beef", "Broccoli", "Buckwheat", "Butter",
    "Caffeine", "Carrots", "Cashews", "Celery", "Cheese", "Chicken", "Chocolate", "Coconut", "Corn", "Crab",
    "Dairy", "Duck", "Eggs", "Fish", "Garlic", "Gluten", "Hazelnuts", "Honey",
    "Kiwi", "Lactose", "Lamb", "Lemon", "Lobster", "Mango", "Milk", "Mushrooms", "Mustard",
    "Nuts", "Oats", "Onions", "Oranges", "Oysters", "Papaya", "Peanuts", "Pecans", "Pine Nuts", "Pork",
    "Quinoa", "Rice", "Rye", "Salmon", "Scallops", "Sesame", "Shellfish", "Shrimp", "Soy", "Strawberries",
    "Tomatoes", "Tree Nuts", "Tuna", "Turkey", "Vanilla", "Walnuts", "Wheat", "Yeast"
  ];

  const filteredAllergies = allergyOptions.filter(allergy =>
    allergy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy)
        ? prev.filter(item => item !== allergy)
        : [...prev, allergy]
    );
  };

  const handleNext = () => {
    navigate("/success");
  };

  const handleBack = () => {
    navigate("/dietary-restrictions");
  };

  const handleSkip = () => {
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background/95 backdrop-blur-sm rounded-lg shadow-elegant border border-border/50 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, User!
          </h1>
          <p className="text-muted-foreground">
            Let's setup your profile.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            What are you allergic to?
          </h2>

          <div className="mb-6">
            <label className="text-foreground font-medium mb-2 block">Search</label>
            <Input
              type="text"
              placeholder="e.g. Chicken"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <ScrollArea className="h-80 border border-border/50 rounded-lg p-4">
            <div className="space-y-3">
              {filteredAllergies.map((allergy) => (
                <div 
                  key={allergy}
                  className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => handleAllergyToggle(allergy)}
                >
                  <Checkbox
                    id={allergy}
                    checked={selectedAllergies.includes(allergy)}
                    onCheckedChange={() => handleAllergyToggle(allergy)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label 
                    htmlFor={allergy}
                    className="text-foreground font-medium cursor-pointer flex-1"
                  >
                    {allergy}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="border-border/50 hover:bg-accent/50"
          >
            Back
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
            <Button 
              variant="hero" 
              onClick={handleNext}
              className="px-8"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allergies;