import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export const AuthForm = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-background/80 border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                    brandButtonText: 'hsl(var(--primary-foreground))',
                    defaultButtonBackground: 'hsl(var(--secondary))',
                    defaultButtonBackgroundHover: 'hsl(var(--secondary))',
                    inputBackground: 'hsl(var(--background))',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderHover: 'hsl(var(--border))',
                    inputBorderFocus: 'hsl(var(--ring))',
                    inputText: 'hsl(var(--foreground))',
                    messageText: 'hsl(var(--muted-foreground))',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'rounded-md px-4 py-2 w-full font-medium shadow-sm transition-colors',
                label: 'text-sm font-medium text-foreground',
                input: 'mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                message: 'text-sm text-muted-foreground mt-2',
              },
            }}
            providers={[]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};