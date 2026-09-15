import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client";

const OAUTH_BROKER_URL = "https://wiskow-concept-elevated.lovable.app/~oauth/initiate";

export async function signInWithGoogle(redirectUri: string) {
  const auth = createLovableAuth({ oauthBrokerUrl: OAUTH_BROKER_URL });
  const result = await auth.signInWithOAuth("google", {
    redirect_uri: redirectUri,
    extraParams: { prompt: "select_account" },
  });

  if (result.redirected || result.error) return result;

  const { error } = await supabase.auth.setSession(result.tokens);
  if (error) return { error };

  return result;
}