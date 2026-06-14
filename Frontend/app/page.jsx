import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroVideo from "./components/HeroVideo";
import ProductCard from "./components/ProductCard";
import { media } from "./data/media";
import { collectionItems, products } from "./data/products";

const categoryLinks = ["Kanjivaram Silks", "Gadwal Pattu", "Pochampally", "Organza"];

export default function HomePage() {
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
            <img className="hero-back-image active" src={media.homeSliderImage} alt="Sahanvi home slider" />
            <HeroVideo src={media.storyVideo} />
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
      </main>
      <Footer />
    </div>
  );
}
