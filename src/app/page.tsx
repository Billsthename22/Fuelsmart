'use client'; 

import Image from 'next/image';
import Navbar from './components/Navbar';
import Cards from './components/Cards'
import Faq from './components/faq'

export default function Home() {
  return (
    <main className="bg-[#0D1B2A] text-white min-h-screen">
      {/* NAVBAR */}
     <Navbar/>
      {/* HERO SECTION */}
      <section className="px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-10">
          {/* Left Side */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find the Cheapest Fuel Around You
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Compare prices, avoid long queues, save fuel.
            </p>
            <div className="flex justify-center md:justify-start gap-4 mb-10 flex-wrap">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold">
                Use My Location
              </button>
              <button className="border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-[#153146] transition">
                Search Area
              </button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image src="/fuuelmaoicon.png" alt="Map icon" width={300} height={300} />
          </div>
        </div>
      </section>
      {/* OVERLAP CARDS SECTION */}
      <Cards/>
 {/* HOW IT WORKS */}
 
 <section className="bg-white text-black py-12 px-6">
  <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
  <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
    {[
      { icon: '📍', label: 'Enable Location' },
      { icon: '🗺️', label: 'View Nearby Stations' },
      { icon: '💰', label: 'Save on Fuel' },
    ].map((item, idx) => (
      <div key={idx} className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
        <span className="text-5xl">{item.icon}</span>
        <p className="mt-4 text-lg font-semibold">{item.label}</p>
      </div>
    ))}
  </div>
</section>

{/* TESTIMONIALS */}
<section className="bg-[#f9fafb] py-20 text-black px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-12">What People Are Saying</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { quote: 'FuelSmart helped me find fuel stations with zero queues. Life saver!', name: 'Amina, Lagos' },
        { quote: 'The accuracy of pricing is insane. I rely on it daily.', name: 'Tobi, Abuja' },
        { quote: 'Clean design, easy to use, and always up to date.', name: 'Chuka, PH' },
      ].map((item, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <p className="italic text-gray-700">“{item.quote}”</p>
          <p className="mt-4 font-semibold text-green-700">{item.name}</p>
        </div>
      ))}
    </div>
  </div>
</section>
{/* NEWSLETTER SIGNUP */}
<section className="bg-green-50 py-20 text-black px-6">
  <div className="max-w-xl mx-auto text-center">
    <h3 className="text-2xl font-bold mb-4">Stay Updated with Fuel Prices</h3>
    <p className="text-gray-600 mb-6">Sign up to get real-time fuel updates delivered to your inbox.</p>
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
</section>
{/* FAQ */}
<Faq/>
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">FuelSmart Naija</h3>
            <p className="text-sm text-gray-400">©️ {new Date().getFullYear()} All rights reserved</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
