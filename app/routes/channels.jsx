import { Link, Outlet, useLoaderData } from "@remix-run/react";
import channels from "~/data/channels.json";

export const loader = () => {
  return { channels };
};

export default function ChannelsLayoutRoute() {
  const { channels } = useLoaderData();

  return (
    <div>
      {channels.map((channel) => (
        <p key={channel.id}>
          <Link to={channel.id}>{channel.title}</Link>
        </p>
      ))}
      <Outlet />
    </div>
  );
}
