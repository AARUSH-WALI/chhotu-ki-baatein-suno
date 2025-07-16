import { MessageSquare, BookOpen, Heart, Save, User, Plus, ChefHat } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    {
      title: "New Chat",
      icon: MessageSquare,
      action: () => console.log("New chat"),
      variant: "hero" as const
    }
  ];

  const cooksyBookItems = [
    {
      title: "Generated Recipes",
      icon: ChefHat,
      action: () => console.log("Generated recipes")
    },
    {
      title: "Liked Recipes",
      icon: Heart,
      action: () => console.log("Liked recipes")
    },
    {
      title: "Saved Recipes",
      icon: Save,
      action: () => console.log("Saved recipes")
    },
    {
      title: "Personal Recipes",
      icon: User,
      action: () => console.log("Personal recipes")
    }
  ];

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-sidebar border-sidebar-border transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent className="px-3 py-4">
        {/* New Chat Button */}
        <div className="mb-6">
          <Button
            variant="hero"
            className={`w-full ${
              collapsed ? "px-3" : "px-4"
            } py-3 bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 animate-glow-pulse`}
            onClick={menuItems[0].action}
          >
            <MessageSquare className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span className="font-medium">New Chat</span>}
          </Button>
        </div>

        {/* CookSy Book Section */}
        <SidebarGroup className="animate-fade-in">
          <SidebarGroupLabel className={`text-sidebar-foreground/70 font-semibold text-sm mb-3 ${
            collapsed ? "text-center" : ""
          }`}>
            {collapsed ? (
              <BookOpen className="h-4 w-4 mx-auto" />
            ) : (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                CookSy Book
              </div>
            )}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {cooksyBookItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`w-full ${
                      collapsed ? "px-3 justify-center" : "px-4 justify-start"
                    } py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group animate-slide-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={item.action}
                  >
                    <item.icon className={`h-4 w-4 ${
                      collapsed ? "" : "mr-3"
                    } group-hover:text-primary transition-colors duration-200`} />
                    {!collapsed && (
                      <span className="text-sm font-medium group-hover:text-sidebar-accent-foreground">
                        {item.title}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Add Recipe Button */}
        {!collapsed && (
          <div className="mt-8 animate-bounce-in" style={{ animationDelay: "500ms" }}>
            <Button
              variant="outline"
              className="w-full py-3 border-sidebar-border hover:bg-sidebar-accent hover:border-primary transition-all duration-300 group"
            >
              <Plus className="h-4 w-4 mr-3 group-hover:text-primary transition-colors duration-200" />
              <span className="text-sm font-medium">Add Recipe</span>
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}