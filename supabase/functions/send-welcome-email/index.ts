import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ZEPTO_API_KEY = Deno.env.get("ZEPTO_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  temporaryPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, temporaryPassword }: EmailRequest = await req.json();

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create user account with temporary password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError) throw authError;

    console.log("User account created successfully:", authData);

    if (!ZEPTO_API_KEY) {
      throw new Error("ZEPTO_API_KEY is not set");
    }

    // Send welcome email using Zepto Mail
    const res = await fetch("https://api.zeptomail.ca/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${ZEPTO_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          address: "support@operations-link.com",
        },
        to: [{
          email_address: {
            address: email,
            name: `${firstName} ${lastName}`,
          },
        }],
        subject: "Welcome to the Team Portal - Set Up Your Account",
        htmlbody: `
          <div>
            <h1>Welcome to the Team Portal, ${firstName}!</h1>
            <p>Your account has been created. Please use the following temporary password to log in:</p>
            <p><strong>${temporaryPassword}</strong></p>
            <p>For security reasons, you will be required to change your password when you first log in.</p>
            <p>Click here to log in: <a href="${SUPABASE_URL}">Team Portal</a></p>
            <p>Best regards,<br>The Team</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Zepto Mail API error:", errorData);
      throw new Error("Failed to send email");
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

serve(handler);