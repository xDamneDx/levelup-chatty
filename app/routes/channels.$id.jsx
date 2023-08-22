import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import supabase from "~/utils/supabase";

export const loader = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from("channels")
    .select("id, title, messages(id, content)")
    .match({ id })
    .single();

  if (error) {
    console.error(error);
  }

  return { channel };
};

export const action = async ({ request, params: { id: channel_id } }) => {
  const formData = await request.formData();
  const content = formData.get("content");

  const { error } = await supabase
    .from("messages")
    .insert({ content, channel_id });

  if (error) {
    console.error(error.message);
  }

  return null;
};

export default function ChannelRoute() {
  const fetcher = useFetcher();
  const { channel } = useLoaderData();
  const [messages, setMessages] = useState([...channel.messages]);

  useEffect(() => {
    supabase
      .channel(`messages-${channel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channel.id}`,
        },
        () => {
          fetcher.load(`/channels/${channel.id}`);
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setMessages([...fetcher.data.channel.messages]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    setMessages([...channel.messages]);
  }, [channel]);

  return (
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <Form method="post">
        <input type="text" name="content" />
        <button>Send!</button>
      </Form>
    </div>
  );
}
