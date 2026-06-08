import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CollectionShop from "../../components/CollectionShop";
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
  "Paithani Yellow": "Explore Paithani Yellow sarees with radiant festive colour, ornate borders, and graceful heirloom-inspired detailing.",
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
  Kalamkari: "Explore Kalamkari sarees with story-rich hand-painted and printed artistry, expressive motifs, and timeless craft charm.",
  "Sahanvi Vintage": "Explore Sahanvi Vintage sarees curated for heirloom charm, rich tradition, and timeless artistry."
};

const heroImages = {
  Kalamkari: media.kalamkariSaree,
  "Paithani Yellow": media.paithaniYellowSaree
};

export default async function CollectionPage({ params }) {
  const type = decodeURIComponent((await params).type);
  const description = descriptions[type] || `Explore ${type} sarees crafted with rich tradition, elegant drapes, and timeless artistry.`;
  const heroImage = heroImages[type] || media.bannerPerson;

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
            <img className="collection-hero-image" src={heroImage} alt={type} />
          </div>
        </section>
        <CollectionShop type={type} />
      </main>
      <Footer />
    </div>
  );
}
