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
    if (!ZEPTO_API_KEY) {
      console.error("ZEPTO_API_KEY is not set");
      throw new Error("Email service configuration is missing");
    }

    const { email, firstName, lastName, temporaryPassword }: EmailRequest = await req.json();

    console.log("Received request to create user and send welcome email:", {
      email,
      firstName,
      lastName,
    });

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create user account with temporary password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError) {
      console.error("Error creating user account:", authError);
      throw authError;
    }

    console.log("User account created successfully:", authData);

    // Send welcome email using Zepto Mail
    const emailResponse = await fetch("https://api.zeptomail.ca/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${ZEPTO_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          address: "support@operations-link.com",
          name: "Operations Link",
        },
        to: [{
          email_address: {
            address: email,
            name: `${firstName} ${lastName}`,
          },
        }],
        subject: "Welcome to Operations Link - Set Up Your Account",
        htmlbody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Operations Link, ${firstName}!</h1>
            <p>Your account has been created successfully. Please use the following temporary password to log in:</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <strong style="font-size: 18px;">${temporaryPassword}</strong>
            </div>
            <p><strong>Important:</strong> For security reasons, you will be required to change your password when you first log in.</p>
            <p>Click the button below to access your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${SUPABASE_URL}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Log In to Your Account</a>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The Operations Link Team</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Zepto Mail API error:", errorData);
      throw new Error("Failed to send welcome email");
    }

    const emailResult = await emailResponse.json();
    console.log("Welcome email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, message: "User created and welcome email sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request",
        details: error.details || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

serve(handler);