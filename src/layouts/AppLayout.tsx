import { 
  Sidebar, 
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { MainNav } from "@/components/MainNav";
import { cn } from "@/lib/utils";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative flex min-h-screen w-full">
        <Sidebar>
          <MainNav />
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