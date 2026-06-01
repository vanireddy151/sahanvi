import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { media } from "../../data/media";

const descriptions = {
  "Kanjivaram Silks": "At Sahanvi, we treat every Kanjivaram silk saree as a piece of tradition. Our artisans weave each saree in pure silk with rich zari, bringing South Indian heritage to life.",
  Organza: "Shop Organza sarees with airy drapes, graceful translucence, and modern occasion charm.",
  Tussar: "Discover Tussar sarees with earthy texture, refined sheen, and effortless everyday sophistication."
};

const bodyColours = [
  ["Beige", "#f2f0d2"],
  ["Black", "#050505"],
  ["Blue", "#0808f7"],
  ["Brown", "#b02f2f"],
  ["Burgundy", "#8d0025"],
  ["Cream", "#fffbd1"]
];

const filterGroups = ["Material", "Design", "Border", "Blouse", "Zari Colour", "Weave", "Pallu Colour"];

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
          <div className="collection-shop-layout">
            <aside className="collection-filters" aria-label={`${type} filters`}>
              <div className="filter-price">
                <input type="range" min="14860" max="43240" defaultValue="43240" aria-label="Price range" />
                <p>Price: ₹14,860 - ₹43,240</p>
              </div>

              <details className="filter-panel" open>
                <summary>Body Colour</summary>
                <label className="filter-search">
                  <span>⌕</span>
                  <input type="search" placeholder="Search Body Colour" />
                </label>
                <div className="colour-filter-grid">
                  {bodyColours.map(([name, colour]) => (
                    <label className="colour-option" key={name}>
                      <input type="checkbox" defaultChecked={["Black", "Brown", "Burgundy"].includes(name)} />
                      <span className="colour-swatch" style={{ "--swatch": colour }}></span>
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
                <button className="show-more-filter" type="button">Show More</button>
              </details>

              {filterGroups.map((group) => (
                <details className="filter-panel filter-panel-compact" key={group}>
                  <summary>{group}</summary>
                  <div className="filter-placeholder">Available options will appear here.</div>
                </details>
              ))}
            </aside>

            <div className="collection-results">
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
