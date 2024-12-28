import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarToggle = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarTrigger className="ml-auto">
      <ChevronRight className={cn(
        "h-4 w-4 transition-transform",
        isCollapsed ? "rotate-0" : "rotate-180"
      )} />
    </SidebarTrigger>
  );
};

export function MainNav() {
  return (
    <>
      <SidebarHeader className="flex h-16 items-center justify-between border-b px-6">
        <span className="text-lg font-semibold tracking-tight">Navigation</span>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu />
      </SidebarContent>
    </>
  );
}