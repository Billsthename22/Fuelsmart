"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#192337] relative overflow-hidden">
      {/* Container */}
      <div className="relative w-[900px] h-[500px] bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Sliding Panel with ONLY Background Image */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-cover bg-center rounded-r-[100px] flex flex-col items-center justify-center text-white text-center p-10 transition-all duration-700 ease-in-out ${
            isLogin ? "translate-x-[100%] rounded-l-[100px] rounded-r-none" : ""
          }`}
          style={{
            backgroundImage: "url('/fuelsmartloginimg.png')", // place image in /public
          }}
        >
          {isLogin ? (
            <>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Welcome Back!
              </h1>
              <p className="text-lg mb-6 drop-shadow-md">
                Already have an account?
              </p>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="border-2 border-white py-2 px-6 rounded-md hover:bg-white hover:text-blue-500 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Hello, Welcome!
              </h1>
              <p className="text-lg mb-6 drop-shadow-md">
                Don’t have an account?
              </p>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="border-2 border-white py-2 px-6 rounded-md hover:bg-white hover:text-blue-500 transition"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Register Form */}
        <div
          className={`absolute right-0 w-1/2 h-full bg-white flex flex-col items-center justify-center text-center p-10 text-gray-800 transform transition-all duration-700 ease-in-out ${
            isLogin
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-3 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-md"
          />
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Register
          </button>

          {/* OR divider */}
          <div className="flex items-center w-full my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Logins */}
          <button className="w-full border py-2 mb-2 rounded-md flex items-center justify-center hover:bg-gray-100">
            <FcGoogle className="w-5 h-5 mr-2" />
            Register with Google
          </button>
          <button className="w-full border py-2 rounded-md flex items-center justify-center hover:bg-gray-100">
            <FaApple className="w-5 h-5 mr-2" />
            Register with Apple
          </button>
        </div>

        {/* Login Form */}
        <div
          className={`absolute right-0 w-1/2 h-full bg-white flex flex-col items-center justify-center text-center p-10 text-gray-800 transform transition-all duration-700 ease-in-out ${
            isLogin ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-2 border rounded-md"
          />

          {/* Remember me + Forgot password */}
          <div className="flex justify-between items-center w-full text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          {/* OR divider */}
          <div className="flex items-center w-full my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Logins */}
          <button className="w-full border py-2 mb-2 rounded-md flex items-center justify-center hover:bg-gray-100">
            <FcGoogle className="w-5 h-5 mr-2" />
            Login with Google
          </button>
          <button className="w-full border py-2 rounded-md flex items-center justify-center hover:bg-gray-100">
            <FaApple className="w-5 h-5 mr-2" />
            Login with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
