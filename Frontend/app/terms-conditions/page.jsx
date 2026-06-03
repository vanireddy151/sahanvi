import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="policy-page">
        <article className="policy-panel">
          <h1>Terms & Conditions</h1>
          <p>Welcome to Sahanvi Saree. By browsing, accessing, or placing an order through our website, you agree to the terms outlined below along with our Privacy Policy, Shipping Policy, and Return & Exchange Policy.</p>

          <h2>Website Usage</h2>
          <p>Website content is intended for general information, personal use, and online shopping. Product descriptions, pricing, images, and details may be updated or changed without prior notice.</p>

          <h2>Intellectual Property</h2>
          <p>All logos, product images, text, visual design, videos, and brand elements are the property of Sahanvi Saree or used with permission. They may not be copied or commercially used without written consent.</p>

          <h2>Product Representation</h2>
          <p>Many sarees are handcrafted or handwoven. Slight irregularities, texture differences, or weave variations are natural characteristics and should not be considered defects.</p>

          <h2>Order Acceptance & Cancellation</h2>
          <p>Orders are subject to confirmation and acceptance. We may refuse, limit, or cancel orders due to incorrect pricing, product unavailability, suspected fraud, payment issues, or policy violation.</p>

          <h2>Pricing & Payments</h2>
          <p>Payments are processed through approved methods or third-party gateways. Sahanvi Saree does not store confidential card or banking details and is not responsible for third-party payment service failures.</p>

          <h2>Customer Conduct</h2>
          <p>Customers are expected to communicate respectfully with support teams. Abusive or inappropriate behaviour may result in restricted access to services.</p>

          <h2>Governing Law</h2>
          <p>These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the competent courts in India.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
