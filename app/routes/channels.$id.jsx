import {
  Form,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { requireAuth } from "../utils/auth.server";

export const loader = async ({ request, params: { id } }) => {
  const { supabase } = await requireAuth(request);

  const { data: channel, error } = await supabase
    .from("channels")
    .select(
      "id, title, description, messages(id, content, likes, profiles(email, username))"
    )
    .match({ id })
    .single();

  if (error) {
    console.error(error);
  }

  return { channel };
};

export const action = async ({ request, params: { id: channel_id } }) => {
  const { supabase } = await requireAuth(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const formData = await request.formData();
  const content = formData.get("content");

  const { error } = await supabase
    .from("messages")
    .insert({ content, channel_id, user_id: user.id });

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

  const handleIncrement = async (message_id) => {
    // call increment function from postgres!
    await supabase.rpc("increment_likes", {
      message_id,
    });
  };

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
              <span className="block px-2 text-xs text-gray-500">
                {message.profiles.username ?? message.profiles.email}
              </span>
              <span className="block px-2 text-xs text-gray-500">
                {message.likes} likes{" "}
                <button onClick={() => handleIncrement(message.id)}>👍🏻</button>
              </span>
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
