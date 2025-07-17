import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, LogOut, Sun, Moon, Menu } from "lucide-react";
import cooksyLogo from "@/assets/cooksy-logo.png";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("recipes");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const recipes = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d-5e94?w=400&h=300&fit=crop",
      title: "Rajma Rice",
      prepTime: "45 mins",
      difficulty: "Medium" as const,
      servings: 4,
      ingredients: [
        "1 cup rajma (kidney beans), soaked overnight",
        "1 cup basmati rice",
        "2 onions, chopped",
        "3 tomatoes, chopped",
        "4 garlic cloves, minced",
        "1 inch ginger, grated",
        "2 tsp cumin seeds",
        "1 tsp turmeric powder",
        "2 tsp red chili powder",
        "1 tsp garam masala",
        "Salt to taste",
        "2 tbsp oil",
        "Fresh coriander for garnish"
      ],
      tools: ["Pressure Cooker", "Pan", "Wooden Spoon", "Knife", "Cutting Board"],
      process: [
        "Soak rajma overnight and pressure cook for 15-20 minutes until soft.",
        "Heat oil in a pan and add cumin seeds. Let them splutter.",
        "Add chopped onions and sauté until golden brown.",
        "Add ginger-garlic paste and cook for 2 minutes.",
        "Add chopped tomatoes and cook until they become soft and mushy.",
        "Add turmeric, red chili powder, and garam masala. Mix well.",
        "Add cooked rajma with its water and simmer for 15 minutes.",
        "Meanwhile, cook basmati rice separately.",
        "Garnish rajma with fresh coriander and serve hot with rice."
      ],
      macros: { calories: 380, carbs: 65, protein: 18, fat: 8 }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d5e7?w=400&h=300&fit=crop",
      title: "Chicken Biryani",
      prepTime: "1.5 hours",
      difficulty: "Hard" as const,
      servings: 6,
      ingredients: [
        "500g basmati rice",
        "750g chicken, cut into pieces",
        "1 cup yogurt",
        "2 onions, sliced",
        "4 tbsp ghee",
        "1 tsp saffron",
        "1/4 cup warm milk",
        "2 bay leaves",
        "4-5 green cardamom",
        "1 black cardamom",
        "2 inch cinnamon stick",
        "1 tsp ginger-garlic paste",
        "1 tsp red chili powder",
        "1/2 tsp turmeric powder",
        "1 tsp biryani masala",
        "Salt to taste",
        "Fresh mint leaves",
        "Fried onions for garnish"
      ],
      tools: ["Heavy-bottomed Pot", "Frying Pan", "Strainer", "Wooden Spoon"],
      process: [
        "Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, and salt for 30 minutes.",
        "Soak saffron in warm milk and set aside.",
        "Fry sliced onions until golden brown and crispy. Set aside.",
        "In the same oil, cook marinated chicken until 70% done.",
        "Boil water with whole spices and salt. Add soaked rice and cook until 70% done.",
        "Layer the partially cooked rice over chicken.",
        "Sprinkle fried onions, mint leaves, and saffron milk on top.",
        "Cover with aluminum foil, then place the lid.",
        "Cook on high heat for 3-4 minutes, then reduce to low heat and cook for 45 minutes.",
        "Let it rest for 10 minutes before opening. Gently mix and serve hot."
      ],
      macros: { calories: 520, carbs: 58, protein: 35, fat: 18 }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      title: "Chocolate Cake",
      prepTime: "1 hour",
      difficulty: "Medium" as const,
      servings: 8,
      ingredients: [
        "2 cups all-purpose flour",
        "2 cups sugar",
        "3/4 cup cocoa powder",
        "2 tsp baking soda",
        "1 tsp baking powder",
        "1 tsp salt",
        "2 eggs",
        "1 cup buttermilk",
        "1 cup hot coffee",
        "1/2 cup vegetable oil",
        "1 tsp vanilla extract",
        "For frosting: 200g dark chocolate, 200ml cream"
      ],
      tools: ["Electric Mixer", "Cake Pan", "Wire Rack", "Measuring Cups", "Spatula"],
      process: [
        "Preheat oven to 180°C. Grease and flour two 9-inch cake pans.",
        "Mix all dry ingredients in a large bowl.",
        "In another bowl, whisk together eggs, buttermilk, oil, and vanilla.",
        "Combine wet and dry ingredients, then gradually add hot coffee.",
        "Divide batter between prepared pans.",
        "Bake for 30-35 minutes or until a toothpick comes out clean.",
        "Cool in pans for 10 minutes, then turn out onto wire racks.",
        "For frosting, heat cream and pour over chopped chocolate. Stir until smooth.",
        "Once cakes are completely cool, frost and serve."
      ],
      macros: { calories: 450, carbs: 75, protein: 8, fat: 16 }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
      title: "Pav Bhaji",
      prepTime: "40 mins",
      difficulty: "Easy" as const,
      servings: 4,
      ingredients: [
        "4 potatoes, boiled and mashed",
        "1 cup mixed vegetables (peas, carrots, beans)",
        "2 onions, finely chopped",
        "3 tomatoes, chopped",
        "1 bell pepper, chopped",
        "4 garlic cloves, minced",
        "1 inch ginger, grated",
        "3 tbsp pav bhaji masala",
        "1 tsp red chili powder",
        "1/2 tsp turmeric powder",
        "4 tbsp butter",
        "8 pav buns",
        "Coriander leaves for garnish",
        "Lemon wedges",
        "Raw onions for serving"
      ],
      tools: ["Large Pan", "Potato Masher", "Ladle", "Knife", "Cutting Board"],
      process: [
        "Boil and mash all vegetables coarsely. Set aside.",
        "Heat butter in a large pan and sauté onions until translucent.",
        "Add ginger-garlic paste and cook for 2 minutes.",
        "Add chopped tomatoes and bell pepper. Cook until soft.",
        "Add pav bhaji masala, red chili powder, and turmeric. Mix well.",
        "Add mashed vegetables and mix thoroughly.",
        "Add water as needed to achieve desired consistency.",
        "Simmer for 10-15 minutes, mashing occasionally.",
        "Heat pav buns with butter on a griddle.",
        "Serve hot bhaji with buttered pav, raw onions, and lemon wedges."
      ],
      macros: { calories: 320, carbs: 52, protein: 8, fat: 12 }
    }
  ];

  const beverages = [
    { id: 1, image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop", title: "Fresh Smoothie" },
    { id: 2, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop", title: "Herbal Tea" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-warm">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/95 backdrop-blur-md border-b border-border/50">
          {/* Left Section with Sidebar Toggle and Logo */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="hover:bg-accent/50 hover:text-primary transition-all duration-200 p-2 rounded-md">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex items-center space-x-3">
              <img 
                src={cooksyLogo} 
                alt="Cooksy Logo" 
                className="h-10 w-10 rounded-lg shadow-card"
              />
              <h1 className="text-xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
                Cooksy
              </h1>
            </div>
          </div>

          {/* Right Section - Account */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:shadow-glow transition-all duration-300">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border-border/50 shadow-glow" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">john.doe@gmail.com</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Welcome back!
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-accent/50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-accent/50 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Layout with Sidebar */}
        <div className="flex w-full">
          <AppSidebar />
          
          {/* Main Content */}
          <main className="flex-1 pt-20 px-4 py-8">
            {/* Enhanced Filter Tabs */}
            <div className="flex justify-center mb-12">
              <div className="relative bg-background/60 backdrop-blur-md rounded-2xl p-2 border border-border/30 shadow-glow">
                <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl"></div>
                <div className="relative flex">
                  <Button
                    variant={activeFilter === "recipes" ? "hero" : "ghost"}
                    className={`relative px-10 py-4 rounded-xl font-semibold text-base transition-all duration-500 ${
                      activeFilter === "recipes" 
                        ? "bg-gradient-hero text-primary-foreground shadow-glow animate-bounce-in transform scale-105" 
                        : "hover:bg-accent/30 hover:text-primary hover:scale-105"
                    }`}
                    onClick={() => setActiveFilter("recipes")}
                  >
                    🍳 Recipes
                  </Button>
                  <Button
                    variant={activeFilter === "beverages" ? "hero" : "ghost"}
                    className={`relative px-10 py-4 rounded-xl font-semibold text-base transition-all duration-500 ${
                      activeFilter === "beverages" 
                        ? "bg-gradient-hero text-primary-foreground shadow-glow animate-bounce-in transform scale-105" 
                        : "hover:bg-accent/30 hover:text-primary hover:scale-105"
                    }`}
                    onClick={() => setActiveFilter("beverages")}
                  >
                    🥤 Beverages
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-6xl mx-auto">
              {activeFilter === "recipes" && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-hero bg-clip-text text-transparent">
                    ✨ Featured Recipes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recipes.map((recipe, index) => (
                    <div
                      key={recipe.id}
                      className="group bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-glow border border-border/20 hover:shadow-warm hover:border-primary/30 transition-all duration-700 hover:scale-[1.03] cursor-pointer animate-slide-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                          <span className="text-xs font-medium text-primary">{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                          {recipe.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          Delicious and easy to make
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            ⏱️ {recipe.prepTime}
                          </span>
                          <span className="flex items-center">
                            👥 {recipe.servings} servings
                          </span>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}

              {activeFilter === "beverages" && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-hero bg-clip-text text-transparent">
                    🥤 Refreshing Beverages
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {beverages.map((beverage, index) => (
                    <div
                      key={beverage.id}
                      className="group bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-glow border border-border/20 hover:shadow-warm hover:border-primary/30 transition-all duration-700 hover:scale-[1.03] cursor-pointer animate-slide-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={beverage.image}
                          alt={beverage.title}
                          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                          {beverage.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Perfect for any time of day
                        </p>
                      </div>
                  </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;