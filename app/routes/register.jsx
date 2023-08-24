import { Form, Link, useOutletContext } from "@remix-run/react";

export default function RegisterRoute() {
  const { supabase } = useOutletContext();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log({ data, error });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-800">
      <h1 className="mb-4 text-4xl">Register</h1>
      <Form className="flex flex-col mb-4" onSubmit={handleRegister}>
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
        <button className="py-2 bg-gray-700">Register</button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
