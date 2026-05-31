import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="policy-page">
        <article className="policy-panel">
          <h1>Privacy Policy</h1>
          <p>At Sahanvi Handloom Sarees, we are committed to safeguarding your privacy and ensuring that your personal information is protected with the highest standards of security and confidentiality.</p>
          <h2>Information We Collect</h2>
          <ul><li>Full Name</li><li>Shipping & Billing Address</li><li>Phone Number</li><li>Email Address</li><li>Payment and transaction details</li></ul>
          <h2>How We Use Your Information</h2>
          <p>We use your information to process orders, provide support, improve services, and share important delivery or payment updates.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
