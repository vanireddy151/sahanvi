import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { media } from "../../data/media";

const descriptions = {
  "Kanjivaram Silks": "At Sahanvi, we treat every Kanjivaram silk saree as a piece of tradition. Our artisans weave each saree in pure silk with rich zari, bringing South Indian heritage to life.",
  Organza: "Shop Organza sarees with airy drapes, graceful translucence, and modern occasion charm.",
  Tussar: "Discover Tussar sarees with earthy texture, refined sheen, and effortless everyday sophistication."
};

export default async function CollectionPage({ params }) {
  const type = decodeURIComponent((await params).type);
  const description = descriptions[type] || `Explore ${type} sarees crafted with rich tradition, elegant drapes, and timeless artistry.`;

  return (
    <div className="next-page">
      <Header />
      <main className="collection-page">
        <section className="collection-hero">
          <div className="collection-copy">
            <h1 className="collection-title">{type}</h1>
            <p className="collection-description">{description}</p>
          </div>
          <img className="collection-hero-image" src={media.bannerPerson2} alt={type} />
        </section>
        <section className="collection-products">
          <div className="collection-tabs">
            <button className="active" type="button">By Design</button>
            <button type="button">By Colour</button>
            <button type="button">By Occasion</button>
            <button type="button">By Material</button>
            <button type="button">By Weave</button>
          </div>
          <div className="product-grid collection-product-grid">
            {["S763878", "S842176", "S529410", "S684302"].map((code, index) => (
              <ProductCard
                key={code}
                name={`${type} Saree ${code}`}
                price={["₹21,020", "₹18,950", "₹16,780", "₹14,520"][index]}
                image={index % 2 ? media.bannerPerson2 : media.bannerPerson}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
