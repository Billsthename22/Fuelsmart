'use client';

export default function StationCards() {
  const stations = [
    { name: 'NNPC', price: '615' },
    { name: 'Mobil', price: '620' },
    { name: 'Total', price: '625' },
  ];

  return (
    <section className="relative z-10">
      <div className="bg-white rounded-t-3xl pt-28 pb-16 px-6 text-black relative z-10">
        <div className="max-w-5xl mx-auto -mt-40 z-20 relative flex flex-wrap justify-center gap-6">
          {stations.map((station, idx) => (
            <div
              key={idx}
              className="bg-white text-black p-6 rounded-xl shadow-xl w-64 border border-gray-200"
            >
              <h3 className="font-bold text-lg">{station.name}</h3>
              <p className="text-green-600 text-xl font-bold">N {station.price}</p>
              <p className="text-sm text-gray-500">Updated just now</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
