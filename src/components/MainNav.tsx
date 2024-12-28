import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarToggle = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarTrigger className="w-full flex justify-end px-2">
      <div className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          isCollapsed ? "rotate-0" : "rotate-180"
        )} />
      </div>
    </SidebarTrigger>
  );
};

export function MainNav() {
  return (
    <>
      <SidebarHeader className="flex h-16 items-center px-6">
        <span className="text-lg font-semibold tracking-tight">Navigation</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu />
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarToggle />
      </SidebarFooter>
    </>
  );
}