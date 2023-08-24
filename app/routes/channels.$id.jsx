import {
  Form,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";
import { requireAuth } from "../utils/auth.server";

export const loader = async ({ request, params: { id } }) => {
  const { supabase } = await requireAuth(request);

  const { data: channel, error } = await supabase
    .from("channels")
    .select("id, title, description, messages(id, content)")
    .match({ id })
    .single();

  if (error) {
    console.error(error);
  }

  return { channel };
};

export const action = async ({ request, params: { id: channel_id } }) => {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      request,
      response,
    }
  );

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
  const { supabase } = useOutletContext();

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
    <>
      <h1 className="mb-2 text-2xl uppercase">{channel.title}</h1>
      <p className="pb-6 text-gray-600 border-b border-gray-300">
        {channel.description}
      </p>
      <div className="flex flex-col flex-1 p-2 overflow-auto">
        <div className="mt-auto">
          {messages.map((message) => (
            <p key={message.id} className="p-2">
              {message.content}
            </p>
          ))}
        </div>
      </div>
      <Form method="post" className="flex">
        <input
          autoComplete="off"
          type="text"
          name="content"
          className="flex-1 px-2 border border-gray-200"
        />
        <button className="px-4 py-2 ml-4 bg-blue-200">Send!</button>
      </Form>
    </>
  );
}
