import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { media } from "../../data/media";
import { allMenuItems } from "../../data/navigation";

export function generateStaticParams() {
  return allMenuItems.map((type) => ({ type }));
}

const descriptions = {
  "Kanjivaram Silks": "At Sahanvi, we treat every Kanjivaram silk saree as a piece of tradition. Our artisans weave each saree in pure silk with rich zari, bringing South Indian heritage to life.",
  Pochampally: "Explore Pochampally sarees known for geometric ikat artistry, vibrant colour play, and handloom-inspired festive elegance.",
  "Banaras Silks": "Discover Banaras silk sarees with luminous zari, classic motifs, and a regal finish for weddings and celebrations.",
  "Gadwal Pattu": "Shop Gadwal Pattu sarees with rich borders, graceful drape, and a heritage feel made for special occasions.",
  "Mysore Silk": "Choose Mysore silk sarees for soft sheen, refined texture, and a timeless South Indian silk look.",
  "Paithani Silk": "Explore Paithani silk sarees with ornate pallus, traditional motifs, and heirloom-inspired artistry.",
  "Jamdani Silk": "Discover Jamdani silk sarees with delicate woven motifs, airy elegance, and understated festive charm.",
  "Muga Silk": "Shop Muga silk sarees admired for natural golden sheen, durability, and graceful heritage appeal.",
  Tussar: "Discover Tussar sarees with earthy texture, refined sheen, and effortless everyday sophistication.",
  Organza: "Shop Organza sarees with airy drapes, graceful translucence, and modern occasion charm.",
  Ikkat: "Explore Ikkat sarees with bold patterning, handloom-inspired geometry, and striking colour balance.",
  "Patola Silk": "Choose Patola silk sarees for intricate pattern work, vivid colour stories, and ceremonial elegance.",
  "Patan Patola": "Discover Patan Patola-inspired sarees with refined symmetry, rich colour, and festive artistry.",
  "Chanderi Silk": "Shop Chanderi silk sarees with light texture, soft shimmer, and elegant occasion-ready comfort.",
  "Kota Silk": "Explore Kota silk sarees with airy weave, graceful fall, and effortless all-day sophistication.",
  "Linen Silk": "Discover Linen Silk sarees with breathable comfort, subtle sheen, and modern everyday elegance.",
  "Kora Silk": "Shop Kora silk sarees with crisp texture, translucent lightness, and refined traditional appeal.",
  "Semi Kota": "Choose Semi Kota sarees for light drape, easy styling, and graceful festive versatility.",
  "Soft Silk": "Explore Soft Silk sarees with smooth drape, gentle lustre, and occasion-ready richness.",
  "Uppada Silk": "Discover Uppada silk sarees with elegant texture, delicate patterns, and graceful handcrafted appeal.",
  "Sahanvi Vintage": "Explore Sahanvi Vintage sarees curated for heirloom charm, rich tradition, and timeless artistry."
};

const bodyColours = [
  ["Beige", "#f2f0d2"],
  ["Black", "#050505"],
  ["Blue", "#0808f7"],
  ["Brown", "#b02f2f"],
  ["Burgundy", "#8d0025"],
  ["Cream", "#fffbd1"]
];

const filterGroups = {
  Material: ["Pure Silk", "Tussar Silk", "Organza", "Linen Silk", "Kora Silk", "Soft Silk"],
  Design: ["Traditional Motifs", "Floral", "Checks", "Temple Border", "Buttas", "Contemporary"],
  Border: ["Zari Border", "Contrast Border", "Small Border", "Big Border", "Plain Border"],
  Blouse: ["With Blouse", "Contrast Blouse", "Running Blouse", "Blouse Detachment"],
  "Zari Colour": ["Gold Zari", "Silver Zari", "Antique Zari", "Copper Zari"],
  Weave: ["Handloom", "Ikkat", "Jamdani", "Jacquard", "Pattu Weave"],
  "Pallu Colour": ["Contrast Pallu", "Self Pallu", "Gold Pallu", "Printed Pallu"]
};
const collectionChips = ["Wedding Ready", "Pure Silk", "Festive Drapes", "Zari Border", "Most Loved"];
const serviceHighlights = ["Authentic handloom-inspired drapes", "Fall & pico support", "Secure checkout", "Carefully packed"];
const productCodes = ["S763878", "S842176", "S529410", "S684302", "S743218", "S905117", "S438920", "S682410"];

export default async function CollectionPage({ params }) {
  const type = decodeURIComponent((await params).type);
  const description = descriptions[type] || `Explore ${type} sarees crafted with rich tradition, elegant drapes, and timeless artistry.`;

  return (
    <div className="next-page">
      <Header />
      <main className="collection-page">
        <section className="collection-hero">
          <div className="collection-copy">
            <p className="collection-kicker">Sahanvi Collection</p>
            <h1 className="collection-title">{type}</h1>
            <p className="collection-description">{description}</p>
            <div className="collection-hero-actions">
              <a href="#collection-products">Shop Now</a>
              <span>8 curated sarees</span>
            </div>
          </div>
          <div className="collection-hero-media">
            <img className="collection-hero-image" src={media.bannerPerson} alt={type} />
          </div>
        </section>
        <section className="collection-products" id="collection-products">
          <div className="collection-chip-row" aria-label="Collection highlights">
            {collectionChips.map((chip) => (
              <button className="collection-chip" type="button" key={chip}>{chip}</button>
            ))}
          </div>
          <div className="collection-shop-layout">
            <aside className="collection-filters" aria-label={`${type} filters`}>
              <div className="filter-heading">
                <h2>Filters</h2>
                <button type="button">Clear All</button>
              </div>
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

              {Object.entries(filterGroups).map(([group, options]) => (
                <details className="filter-panel filter-panel-compact" key={group}>
                  <summary>{group}</summary>
                  <div className="filter-option-list">
                    {options.map((option) => (
                      <label key={option}>
                        <input type="checkbox" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </details>
              ))}
            </aside>

            <div className="collection-results">
              <div className="collection-toolbar">
                <div>
                  <p>{productCodes.length} sarees found</p>
                  <h2>{type} for every occasion</h2>
                </div>
                <label>
                  <span>Sort</span>
                  <select defaultValue="newest">
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Loved</option>
                  </select>
                </label>
              </div>
              <div className="collection-tabs">
                <button className="active" type="button">By Design</button>
                <button type="button">By Colour</button>
                <button type="button">By Occasion</button>
                <button type="button">By Material</button>
                <button type="button">By Weave</button>
              </div>
              <div className="product-grid collection-product-grid">
                {productCodes.map((code, index) => (
                  <ProductCard
                    key={code}
                    name={`${type} Saree ${code}`}
                    price={["₹21,020", "₹18,950", "₹16,780", "₹14,520", "₹23,400", "₹19,760", "₹28,900", "₹17,650"][index]}
                    image={index % 2 ? media.bannerPerson2 : media.bannerPerson}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="collection-service-strip">
            {serviceHighlights.map((item) => (
              <div key={item}>
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
