import { redirect } from "@remix-run/node";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export default function LogoutRoute() {
  const { supabase } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();

      navigate("/login");
    };

    logout();
  }, []);

  return <p>Logging out...</p>;
}
