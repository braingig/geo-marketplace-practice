import ListingSidebar from "@/src/components/ListingSidebar";
import MarketplaceMap from "@/src/components/MarketplaceMap";
import { listings } from "@/src/data/listings";


export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filteredListings = listings.filter(
    (item) => item.slug === slug
  );

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <ListingSidebar listings={filteredListings} />

      <MarketplaceMap listings={filteredListings} />
    </div>
  );
}