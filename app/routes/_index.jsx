import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Chatty Chat" },
    { name: "description", content: "Awesome chat with channels!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-800">
      <h1 className="mb-1 text-2xl">Welcome to the chat!</h1>
      <Link to="/channels">Go to channels</Link>
    </div>
  );
}
