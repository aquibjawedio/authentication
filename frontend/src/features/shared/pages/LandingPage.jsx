import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const techStacks = [
  "Google Login",
  "React Hook Form",
  "Zod Validation",
  "Redux Toolkit",
  "Node.js",
  "Express",
  "MongoDB",
];

const LandingPage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      <div className="text-center px-8 py-12 max-w-2xl">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 mb-4 transition-all duration-500">
          AuthX
        </h1>
        <p className="text-lg mb-8 text-zinc-700 dark:text-zinc-300">
          Secure authentication built with a modern tech stack and beautiful
          simplicity.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {techStacks.map((tech, index) => (
            <div
              key={index}
              className="bg-zinc-200 dark:bg-zinc-800 py-2 px-4 rounded-md text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {tech}
            </div>
          ))}
        </div>

        {user ? (
          <NavLink
            to="/profile"
            className="inline-block bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-400 text-white dark:text-zinc-900 font-semibold py-2.5 px-8 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
          >
            Dashboard
          </NavLink>
        ) : (
          <NavLink
            to="/register"
            className="inline-block bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-400 text-white dark:text-zinc-900 font-semibold py-2.5 px-8 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
          >
            Get Started
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
