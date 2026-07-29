import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroVideo from "./components/HeroVideo";
import ProductCard from "./components/ProductCard";
import { media } from "./data/media";
import { collectionItems, products } from "./data/products";
import { apiUrl } from "./lib/api";

const categoryLinks = ["Kanjivaram Silks", "Gadwal Pattu", "Pochampally", "Organza"];

export const revalidate = 60;

async function getTestimonials() {
  try {
    const response = await fetch(apiUrl("/api/testimonials"), { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <div className="next-page home-page" style={{ "--home-bg-image": `url("${media.homeSliderImage}")` }}>
      <Header />
      <main>
        <section className="hero editorial-hero">
          <img className="hero-flower-mark" src={media.flower} alt="" />
          <div className="hero-text">
            <h1>Every thread<br />tells a story.<br />Every motif carries a legacy.</h1>
            <a className="hero-button" href="/collections">Explore Collection</a>
          </div>
          <div className="hero-media">
            <img className="hero-back-image active" src={media.homeSliderImage} alt="Banaras silk saree — Sahanvi Collection" />
            <HeroVideo src={media.storyVideo} />
          </div>

          <div className="mobile-hero-banner">
            <img src={media.homeSliderImage} alt="Sahanvi handloom sarees" />
            <div className="mobile-hero-banner-overlay" />
            <div className="mobile-hero-banner-copy">
              <p>Every thread tells a story</p>
              <h2>EVERY MOTIF CARRIES A LEGACY</h2>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Why shop with Sahanvi">
          <div className="trust-item">
            <span className="trust-item-mark">H</span>
            <div className="trust-item-copy">
              <h4>Handwoven Authenticity</h4>
              <p>Genuine handloom craftsmanship in every weave</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-item-mark">B</span>
            <div className="trust-item-copy">
              <h4>Custom Blouse Stitching</h4>
              <p>Tailored to your measurements on request</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-item-mark">S</span>
            <div className="trust-item-copy">
              <h4>Secure Shipping</h4>
              <p>Carefully packed and delivered with care</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-item-mark">R</span>
            <div className="trust-item-copy">
              <h4>Easy Returns</h4>
              <p>Hassle-free return and exchange support</p>
            </div>
          </div>
        </section>

        <section className="collections" id="collections">
          <div className="collections-header">
            <div>
              <h2>Our Collections</h2>
              <p>Welcome to the world of elegance and craftsmanship</p>
            </div>
          </div>
          <div className="collection-gallery">
            {collectionItems.map(([name], index) => (
              <a className="collection-card" href={`/${encodeURIComponent(categoryLinks[index % categoryLinks.length])}`} key={`${name}-${index}`}>
                <div className="collection-image">
                  <img src={index % 2 ? media.bannerPerson2 : media.bannerPerson} alt={name} />
                </div>
                <h3>{name.replace(/ S\d+$/, "")}</h3>
                <p>{name.match(/S\d+$/)?.[0]}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="product-showcase" id="new-arrivals">
          <div className="section-heading">
            <h2>New Arrivals</h2>
            <p>Handpicked sarees with timeless weaves and graceful details</p>
          </div>
          <div className="product-grid">
            {products.map(([name, price, image]) => (
              <ProductCard key={name} name={name} price={price} image={image} />
            ))}
          </div>
        </section>

        {testimonials.length ? (
          <section className="happy-customers" id="happy-customers">
            <div className="section-heading">
              <h2>Happy Customers</h2>
              <p>Real moments, real elegance from the Sahanvi family</p>
            </div>
            <div className="happy-customers-grid">
              {testimonials.map((item) => (
                <div className="happy-customer-card" key={item._id}>
                  <img src={apiUrl(item.imageUrl)} alt={item.caption || "A Sahanvi client"} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
