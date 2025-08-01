'use client';

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
  return (
    <section className="bg-white py-20 text-black px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-xl p-6 w-full md:w-1/3 shadow-sm"
            >
              <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
