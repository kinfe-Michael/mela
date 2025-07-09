import BottomContainer from "./components/BottomContainer";
import ProductCard from "./components/ProductCard";
import MusicCard from "./components/ProductCard";
import PageWraper from "./components/PageWraper";
import Scroller from "./components/Scroller";
import Sidebar from "./components/sidebar";

export default function Home() {
  return (
    <PageWraper>
      <Scroller title="favorite">
       {/* <ProductCard
       id="headphones"
          url="/yohana.jpg"
          alt="Awesome Item"
          productName="Awesome Collectible"
          price={75.00}
          
        /> */}
        <div></div>
      </Scroller>
    </PageWraper>
  );
}
