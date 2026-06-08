import Header from "../components/Header";
import Footer from "../components/Footer";
import CollectionShop from "../components/CollectionShop";
import { media } from "../data/media";

export default function NewArrivalsPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="collection-page">
        <section className="collection-hero">
          <div className="collection-copy">
            <p className="collection-kicker">Latest Drapes</p>
            <h1 className="collection-title">New Arrivals</h1>
            <p className="collection-description">Handpicked sarees with timeless weaves, graceful details, and elegant festive appeal.</p>
            <div className="collection-hero-actions">
              <a href="#collection-products">Shop Now</a>
              <span>Freshly added sarees</span>
            </div>
          </div>
          <div className="collection-hero-media">
            <img className="collection-hero-image" src={media.bannerPerson} alt="Sahanvi new arrivals" />
          </div>
        </section>
        <CollectionShop type="New Arrivals" />
      </main>
      <Footer />
    </div>
  );
}
