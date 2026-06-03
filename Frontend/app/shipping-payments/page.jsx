import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ShippingPaymentsPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="policy-page">
        <article className="policy-panel">
          <h1>Shipping & Payments</h1>
          <p>Sahanvi Handloom Sarees ships carefully packed sarees across India. Every order is inspected, folded, packed securely, and prepared with attention to fabric safety.</p>

          <h2>Order Processing</h2>
          <p>Orders are processed after confirmation from the customer. Sarees requiring fall, pico, blouse detachment, tassel work, or other finishing services may take additional time before dispatch.</p>

          <h2>Shipping Timelines</h2>
          <p>Standard dispatch timelines depend on product availability, finishing requests, and delivery location. After dispatch, tracking details will be shared with the customer through available contact channels.</p>

          <h2>Payments</h2>
          <p>Payments may be collected through approved digital payment methods or other confirmed payment options shared by the Sahanvi team. Orders are confirmed only after payment verification where applicable.</p>

          <h2>Delivery Information</h2>
          <p>Please provide a complete delivery address with flat/house number, street, city, state, pincode, and phone number. Incorrect or incomplete addresses may delay delivery.</p>

          <h2>Support</h2>
          <p>For order, shipping, or payment help, contact us at orders@sahanvi.com or call +91 9704888933 / +91 9949779227.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
