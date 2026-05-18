'use client';

interface Listing {
  id: number;
  title: string;
  price: string;
  image: string;
  city: string;
}

export default function ListingSidebar({
  listings,
}: {
  listings: Listing[];
}) {
  return (
    <div className="h-screen overflow-y-auto bg-white p-6">
      <h2 className="mb-6 text-3xl font-bold">Listings</h2>

      <div className="space-y-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-xl"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.city}</p>
              <p className="mt-3 text-2xl font-bold text-cyan-600">
                {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}