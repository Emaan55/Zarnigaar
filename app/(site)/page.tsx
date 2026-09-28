import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { EditorialGrid } from "@/components/home/editorial-grid";
import { SeasonalFavorites } from "@/components/home/seasonal-favorites";
import { getNewArrivals } from "@/data/products";
import { getActiveDeals } from "@/data/deals";

export default async function HomePage() {
  const [products, deals] = await Promise.all([getNewArrivals(12), getActiveDeals()]);

  return (
    <>
      <Hero />
      <NewArrivals products={products} />
      <EditorialGrid deal={deals[0] ?? null} />
      <SeasonalFavorites />
    </>
  );
}
