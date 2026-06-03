import Header from "../components/Header";
import Footer from "../components/Footer";
import { media } from "../data/media";
import { collectionItems } from "../data/products";

const categoryLinks = ["Kanjivaram Silks", "Gadwal Pattu", "Pochampally", "Organza"];

export default function CollectionsPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="listing-page">
        <section className="listing-hero">
          <div>
            <p className="listing-kicker">Sahanvi Handloom Sarees</p>
            <h1>Our Collections</h1>
            <p>Welcome to the world of elegance and craftsmanship, curated across timeless saree traditions.</p>
          </div>
          <img src={media.bannerPerson2} alt="Sahanvi collections" />
        </section>

        <section className="listing-section">
          <div className="collection-gallery">
            {collectionItems.map(([name], index) => (
              <a className="collection-card listing-card" href={`/${encodeURIComponent(categoryLinks[index % categoryLinks.length])}`} key={`${name}-${index}`}>
                <div className="collection-image">
                  <img src={index % 2 ? media.bannerPerson2 : media.bannerPerson} alt={name} />
                </div>
                <h3>{name.replace(/ S\d+$/, "")}</h3>
                <p>{name.match(/S\d+$/)?.[0]}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
