import { Form, Link } from "@remix-run/react";
import supabase from "~/utils/supabase";

export default function LoginRoute() {
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log({ data, error });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-800">
      <h1 className="mb-4 text-4xl">Login</h1>
      <Form className="flex flex-col mb-4" onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          className="px-2 mb-4 bg-transparent border border-gray-200"
          type="email"
          name="email"
          placeholder="john@example.com"
        />
        <label htmlFor="password">Password:</label>
        <input
          className="px-2 mb-8 bg-transparent border border-gray-200"
          type="password"
          name="password"
          placeholder="password"
        />
        <button className="py-2 bg-gray-700">Log In</button>
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
