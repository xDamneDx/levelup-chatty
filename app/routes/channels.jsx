import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import supabase from "~/utils/supabase";

export const loader = async () => {
  const { data: channels, error } = await supabase
    .from("channels")
    .select("id, title");

  if (error) {
    console.error(error.message);
  }

  return { channels };
};

export default function ChannelsLayoutRoute() {
  const [user, setUser] = useState(null);
  const { channels } = useLoaderData();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-40 p-8 text-white bg-gray-800">
        {channels.map((channel) => (
          <p key={channel.id}>
            <Link to={`${channel.id}`}>
              <span className="mr-1 text-gray-400">#</span>
              {channel.title}
            </Link>
          </p>
        ))}
      </div>
      <div className="flex flex-col flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
