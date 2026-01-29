export default function CancelPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>

      <a
        href="/user/bookings"
        className="mt-6 inline-block bg-gray-800 text-white px-5 py-3 rounded"
      >
        Back to Bookings
      </a>
    </div>
  );
}
