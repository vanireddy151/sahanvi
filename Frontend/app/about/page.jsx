import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="next-page">
      <Header />
      <main>
        <section className="about-hero">
          <div>
            <p className="eyebrow">About Sahanvi</p>
            <h1>Handloom sarees chosen with heritage, grace, and everyday celebration in mind.</h1>
          </div>
        </section>
        <section className="about-story">
          <div className="about-copy">
            <h2>Our Story</h2>
            <p>Sahanvi Handloom Sarees brings together timeless Indian weaving traditions and contemporary elegance.</p>
            <p>From Kanjivaram silks to Pochampally and Gadwal weaves, our collection celebrates regional artistry.</p>
          </div>
          <div className="about-values">
            <article>
              <span>✓</span>
              <div>
                <h3>Curated Sarees</h3>
                <p>Each saree is selected for drape, texture, border detail, and occasion value.</p>
              </div>
            </article>
            <article>
              <span>✓</span>
              <div>
                <h3>Customer Support</h3>
                <p>Our team helps with product questions, finishing requests, order confirmation, and delivery details.</p>
              </div>
            </article>
            <article>
              <span>✓</span>
              <div>
                <h3>Careful Packing</h3>
                <p>Every order is checked and packed with care so the saree reaches you safely.</p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
