import { Form, useLoaderData } from "@remix-run/react";
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
  const { channel } = useLoaderData();

  return (
    <div>
      <pre>{JSON.stringify(channel, null, 2)}</pre>
      <Form method="post">
        <input type="text" name="content" />
        <button>Send!</button>
      </Form>
    </div>
  );
}
