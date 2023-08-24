import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { requireAuth } from "../utils/auth.server";

export const loader = async ({ request }) => {
  const { supabase } = await requireAuth(request);

  const { data: channels, error } = await supabase
    .from("channels")
    .select("id, title");

  if (error) {
    console.error(error.message);
  }

  return { channels };
};

export default function ChannelsLayoutRoute() {
  const { supabase } = useOutletContext();
  const { channels } = useLoaderData();

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
        <Outlet context={{ supabase }} />
      </div>
    </div>
  );
}
