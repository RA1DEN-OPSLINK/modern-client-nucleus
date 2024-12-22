import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { MainNav } from "@/components/MainNav";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="relative flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex h-[60px] items-center border-b px-6">
            <span className="text-lg font-semibold">CRM</span>
            <SidebarTrigger className="ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex w-full flex-col">
          <Header />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};