// app/notifications/page.tsx
"use client";

const notifications = [
  {
    id: 1,
    title: "Fuel Price Update",
    message: "Premium fuel price has dropped by ₦15/L today.",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Service Reminder",
    message: "Your car is due for servicing next week. Don’t forget to schedule!",
    time: "1d ago",
  },
  {
    id: 3,
    title: "FuelSmart Promo",
    message: "Get 5% cashback when you buy fuel via FuelSmart Wallet this weekend.",
    time: "3d ago",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500"
          >
            <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
            <p className="text-gray-600">{note.message}</p>
            <span className="text-sm text-gray-400">{note.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
