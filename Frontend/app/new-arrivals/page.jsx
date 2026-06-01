import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { media } from "../data/media";
import { products } from "../data/products";

export default function NewArrivalsPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="listing-page">
        <section className="listing-hero">
          <div>
            <p className="listing-kicker">Latest Drapes</p>
            <h1>New Arrivals</h1>
            <p>Handpicked sarees with timeless weaves, graceful details, and elegant festive appeal.</p>
          </div>
          <img src={media.bannerPerson} alt="Sahanvi new arrivals" />
        </section>

        <section className="listing-section listing-section-cream">
          <div className="product-grid">
            {products.concat(products).map(([name, price, image], index) => (
              <ProductCard key={`${name}-${index}`} name={name} price={price} image={image} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
