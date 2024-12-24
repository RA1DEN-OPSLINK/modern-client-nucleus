import { ChevronRight } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { MainNav } from "@/components/MainNav";
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

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-semibold">Navigation</span>
            <SidebarToggle />
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex w-full flex-col">
          <Header />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};