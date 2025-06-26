import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MusicCard from "../components/ProductCard";
import PageWraper from "../components/PageWraper";
import Scroller from "../components/Scroller";
import ProductCard from "../components/ProductCard";

function page() {
  return (
    <PageWraper>
      <Scroller title="Top">
             <ProductCard
                    url="/yohan.jpg"
                    alt="Awesome Item"
                    productName="Awesome Collectible"
                    price={75.00}
                  
                  />
      </Scroller>
    </PageWraper>
  );
}

export default page;
