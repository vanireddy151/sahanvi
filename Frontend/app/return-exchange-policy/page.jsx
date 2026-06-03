import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReturnPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="policy-page">
        <article className="policy-panel">
          <h1>Return & Exchange Policy</h1>
          <p>At Sahanvi Saree, every saree is thoughtfully handcrafted and carefully inspected before it reaches you. Return and exchange requests are reviewed by the Sahanvi team and processed according to the policy below.</p>

          <h2>Eligibility</h2>
          <ul>
            <li>The product must be unused, unworn, unwashed, and in original condition.</li>
            <li>Original packaging, tags, invoice copies, labels, and barcode stickers must remain intact.</li>
            <li>The request must be initiated within 24 hours of delivery.</li>
            <li>Only one return or exchange request will be accepted per order.</li>
          </ul>

          <h2>Not Considered Defects</h2>
          <p>Minor colour variation due to lighting or display settings, natural handwoven variations, and personal preference around texture, colour, weave, design, or fabric feel will not be treated as defects.</p>

          <h2>Non-Returnable Products</h2>
          <p>Sarees with blouse stitching, fall/pico, tassel work, blouse detachment, custom tailoring, clearance offers, or signs of use, perfume, stains, damage, or tampering are not eligible for return, exchange, or refund.</p>

          <h2>Return Process</h2>
          <p>Customers must email support within 24 hours with order details, clear photographs, and an unboxing video. After approval, the product must be packed securely and shipped through a reliable courier with tracking.</p>

          <h2>Refunds & Shipping</h2>
          <p>Approved refunds or exchanges are processed after inspection within 7 working days. If the issue is not attributable to Sahanvi Saree, return shipping charges are borne by the customer.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
