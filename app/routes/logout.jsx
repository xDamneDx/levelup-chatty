import { useEffect } from "react";
import supabase from "~/utils/supabase";

export default function LogoutRoute() {
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return <p>Logging out...</p>;
}
