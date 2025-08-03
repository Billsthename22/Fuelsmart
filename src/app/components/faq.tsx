'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

const faqData: FAQItem[] = [
  {
    q: '🔄 How often are prices updated?',
    a: 'Prices are updated in real-time as users submit reports.',
  },
  {
    q: '📍 Do I have to enable location?',
    a: 'Not required, but it helps show stations near you faster.',
  },
  {
    q: '🧾 Is FuelSmart free?',
    a: 'Yes, it’s 100% free and always will be.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20 px-6 text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-green-700">
          Frequently Asked Questions
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl border border-green-200 bg-green-50 p-6 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  isOpen ? 'bg-green-100' : ''
                }`}
                onClick={() => toggleFAQ(idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-green-900">{item.q}</h3>
                  {isOpen ? (
                    <ChevronUp className="text-green-700 w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-green-700 w-5 h-5" />
                  )}
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-700 mt-4"
                    >
                      {item.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
