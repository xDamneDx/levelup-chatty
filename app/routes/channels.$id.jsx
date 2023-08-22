import { useLoaderData } from "@remix-run/react";
import supabase from "~/utils/supabase";

export const loader = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from("channels")
    .select("*, messages(id, content)")
    .match({ id })
    .single();

  if (error) {
    console.error(error);
  }

  return { channel };
};

export default function ChannelRoute() {
  const { channel } = useLoaderData();

  return <p>{channel.title}</p>;
}
