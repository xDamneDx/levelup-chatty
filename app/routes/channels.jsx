import { Link, Outlet, useLoaderData } from "@remix-run/react";
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
  const { channels } = useLoaderData();

  return (
    <div>
      {channels.map((channel) => (
        <p key={channel.id}>
          <Link to={`${channel.id}`}>{channel.title}</Link>
        </p>
      ))}
      <Outlet />
    </div>
  );
}
