import { useLoaderData } from "@remix-run/react";
import channels from "~/data/channels.json";

export const loader = ({ params: { id } }) => {
  const channel = channels.find((channel) => channel.id === id);

  return { channel };
};

export default function ChannelRoute() {
  const { channel } = useLoaderData();

  return <p>{channel.title}</p>;
}
