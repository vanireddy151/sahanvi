import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroVideo from "./components/HeroVideo";
import MobileHeroSlider from "./components/MobileHeroSlider";
import ProductCard from "./components/ProductCard";
import ClientDiariesSlider from "./components/ClientDiariesSlider";
import CollectionCardLink from "./components/CollectionCardLink";
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

async function getNewArrivals() {
  try {
    const response = await fetch(apiUrl("/api/sarees"), { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const sarees = await response.json();
    if (!Array.isArray(sarees)) return [];

    return sarees
      .filter((saree) => saree.isNewArrival !== false)
      .filter((saree) => !["sold", "hidden"].includes(String(saree.availability || "available").toLowerCase()))
      .map((saree) => ({
        name: saree.name || `Saree ${saree.code || ""}`.trim(),
        code: saree.code || "",
        price: saree.price ? `₹${Number(saree.price).toLocaleString("en-IN")}` : "₹0",
        image: saree.imageUrl || media.bannerPerson,
        palluImageUrl: saree.palluImageUrl || "",
        borderImageUrl: saree.borderImageUrl || "",
        bodyImageUrl: saree.bodyImageUrl || "",
        fabric: saree.fabric || "",
        occasion: saree.occasion || ""
      }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const testimonials = await getTestimonials();
  const stockArrivals = await getNewArrivals();
  const newArrivals = stockArrivals.length
    ? stockArrivals
    : products.map(([name, price, image]) => ({ name, code: "", price, image, palluImageUrl: "", borderImageUrl: "", bodyImageUrl: "", fabric: "", occasion: "" }));

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

          <MobileHeroSlider
            slides={[
              { type: "video", src: media.storyVideo },
              { type: "video", src: media.mobileHeroVideo2 },
              {
                type: "image",
                src: media.homeSliderImage,
                kicker: "Every thread tells a story",
                title: "EVERY MOTIF CARRIES A LEGACY"
              },
              { type: "image", src: media.bannerPerson2 }
            ]}
          />
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
              <CollectionCardLink className="collection-card" href={`/${encodeURIComponent(categoryLinks[index % categoryLinks.length])}`} key={`${name}-${index}`}>
                <div className="collection-image">
                  <img src={index % 2 ? media.bannerPerson2 : media.bannerPerson} alt={name} />
                </div>
                <h3>{name.replace(/ S\d+$/, "")}</h3>
                <p>{name.match(/S\d+$/)?.[0]}</p>
              </CollectionCardLink>
            ))}
          </div>
        </section>

        <section className="product-showcase" id="new-arrivals">
          <div className="section-heading">
            <h2>New Arrivals</h2>
            <p>Handpicked sarees with timeless weaves and graceful details</p>
          </div>
          <div className="product-grid">
            {newArrivals.map((item, index) => (
              <ProductCard
                key={`${item.name}-${index}`}
                name={item.name}
                price={item.price}
                image={item.image}
                palluImageUrl={item.palluImageUrl}
                borderImageUrl={item.borderImageUrl}
                bodyImageUrl={item.bodyImageUrl}
                fabric={item.fabric}
                occasion={item.occasion}
              />
            ))}
          </div>
        </section>

        {testimonials.length ? (
          <section className="happy-customers" id="happy-customers">
            <div className="section-heading">
              <h2>Client Diaries</h2>
              <p>Real moments, Real elegance.</p>
            </div>
            <ClientDiariesSlider testimonials={testimonials} />
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
