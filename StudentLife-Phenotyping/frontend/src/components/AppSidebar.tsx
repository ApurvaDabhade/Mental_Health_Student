import {
  Brain, Heart, Activity, Smartphone, ClipboardList,
  TrendingUp, BarChart3, Bell, User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sections = [
  { title: "Overview", url: "#overview", icon: Activity },
  { title: "Patient Profile", url: "#patient", icon: User },
  { title: "Vitals & Sensors", url: "#vitals", icon: Heart },
  { title: "Mental Health", url: "#mental", icon: Brain },
  { title: "Behavior", url: "#behavior", icon: Smartphone },
  { title: "Surveys", url: "#surveys", icon: ClipboardList },
  { title: "Predictions", url: "#predictions", icon: TrendingUp },
  { title: "Charts", url: "#charts", icon: BarChart3 },
  { title: "Alerts", url: "#alerts", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            {!collapsed && "Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
