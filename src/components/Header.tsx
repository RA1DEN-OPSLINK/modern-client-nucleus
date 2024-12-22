import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const { session } = useSessionContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {session?.user.email}
        </span>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
};