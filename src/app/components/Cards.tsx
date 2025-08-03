'use client';

import { Clock, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';

// Moved outside the component for better performance
const stations = [
  { name: 'NNPC', price: '615' },
  { name: 'Mobil', price: '620' },
  { name: 'Total', price: '625' },
];

export default function StationCards() {
  return (
    <section className="relative z-10">
      <div className="bg-white  pt-28 pb-16 px-6 text-black relative z-10">
        <div className="max-w-5xl mx-auto -mt-40 z-20 relative flex flex-wrap justify-center gap-6 px-2">
          {stations.map((station, idx) => (
            <motion.div
              key={station.name}
              className="bg-white text-black p-6 rounded-xl shadow-md w-full sm:w-64 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6, ease: 'easeOut' }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 20px 40px rgba(0,0,0,0.15)',
              }}
            >
              {/* Gradient header bar */}
              <div className="h-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-t mb-4" />

              {/* Station name */}
              <h3 className="font-bold text-lg text-center">{station.name}</h3>

              {/* Price section with animated fuel icon and pulsing price */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <Fuel className="w-5 h-5 text-green-600" />
                <motion.p
                  className="text-green-600 text-xl font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  N {station.price}
                </motion.p>
              </div>

              {/* Update time with clock icon */}
              <motion.div
                className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <Clock className="w-4 h-4" />
                <span>Updated just now</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
