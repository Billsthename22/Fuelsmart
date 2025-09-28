"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Cards from "./components/Cards";
import Faq from "./components/faq";
import { MapPin, Map, Fuel } from "lucide-react";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const router = useRouter();

  const handleRedirectToSignup = () => {
    router.push("/Signup");
  };

  return (
    <main className="bg-[#0D1B2A] text-white min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full py-20 bg-gradient-to-b from-[#0D1B2A] to-[#112E42]"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left md:w-1/2"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            >
              Find the{" "}
              <span className="text-green-400">Cheapest Fuel</span> Around You
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-blue-100 mb-8"
            >
              Compare prices, avoid long queues, save fuel.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:justify-start mb-10"
            >
              {/* ✅ Single Get Started Button */}
              <button
                onClick={handleRedirectToSignup}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition animate-pulse"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            variants={itemVariants}
            className="md:w-1/2 flex justify-center md:justify-end"
          >
            <Image
              src="/fuuelmaoicon.png"
              alt="Map icon"
              width={320}
              height={320}
              className="drop-shadow-xl animate-float"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* OVERLAP CARDS SECTION */}
      <Cards />

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 text-black py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {[
            { icon: <MapPin className="w-8 h-8 text-blue-600" />, label: "Enable Location" },
            { icon: <Map className="w-8 h-8 text-green-600" />, label: "View Nearby Stations" },
            { icon: <Fuel className="w-8 h-8 text-red-600" />, label: "Save on Fuel" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl w-64 p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                {item.icon}
              </div>
              <p className="text-lg font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f9fafb] py-20 text-black px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                quote:
                  "FuelSmart helped me find fuel stations with zero queues. Life saver!",
                name: "Amina, Lagos",
              },
              {
                quote: "The accuracy of pricing is insane. I rely on it daily.",
                name: "Tobi, Abuja",
              },
              {
                quote: "Clean design, easy to use, and always up to date.",
                name: "Chuka, PH",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-transform duration-300 hover:scale-[1.03] text-left"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl text-gray-300 mb-4">“</div>
                <p className="italic text-gray-700 leading-relaxed">
                  {item.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <p className="font-semibold text-green-700">{item.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <motion.section
        className="bg-green-50 py-20 text-black px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            Stay Updated with Fuel Prices
          </h3>
          <p className="text-gray-600 mb-6">
            Sign up to get real-time fuel updates delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
              Subscribe
            </button>
          </form>
        </div>
      </motion.section>

      {/* FAQ */}
      <Faq />

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">FuelSmart Naija</h3>
            <p className="text-sm text-gray-400">
              ©️ {new Date().getFullYear()} All rights reserved
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
