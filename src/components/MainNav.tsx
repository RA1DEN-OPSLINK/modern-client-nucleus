import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarToggle = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarTrigger className="absolute -right-3 top-1/2 -translate-y-1/2 z-50">
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-accent">
        <ArrowLeft className={cn(
          "h-3 w-3 transition-transform duration-200",
          isCollapsed ? "-rotate-180" : "rotate-0"
        )} />
      </div>
    </SidebarTrigger>
  );
};

export function MainNav() {
  return (
    <div className="relative h-full">
      <SidebarHeader className="flex h-16 items-center px-6">
        <span className="text-lg font-semibold tracking-tight">Navigation</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu />
      </SidebarContent>
      <SidebarToggle />
    </div>
  );
}