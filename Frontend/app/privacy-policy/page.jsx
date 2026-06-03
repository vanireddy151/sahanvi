import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="policy-page">
        <article className="policy-panel">
          <h1>Privacy Policy</h1>
          <p>At Sahanvi Handloom Sarees, we are committed to safeguarding your privacy and protecting your personal information with care, security, and confidentiality.</p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Full name, phone number, and email address</li>
            <li>Shipping and billing address</li>
            <li>Payment and transaction details</li>
            <li>Identification proof where required for verification</li>
            <li>Messages or order details shared with our support team</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your details to process orders, confirm payments, arrange delivery, respond to support requests, maintain internal records, and improve your shopping experience.</p>

          <h2>Data Protection</h2>
          <p>Your information will not be sold, rented, or traded. We may share only the details required for order fulfillment with trusted logistics, payment, or service partners.</p>

          <h2>Cookies & Website Tracking</h2>
          <p>Our website may use cookies to understand browsing behaviour, improve website functionality, and remember shopping preferences. You may disable cookies in your browser settings.</p>

          <h2>Third-Party Links</h2>
          <p>External links may appear on our website. Sahanvi Handloom Sarees is not responsible for the privacy practices, content, or policies of third-party websites.</p>

          <h2>Contact Us</h2>
          <p>For privacy questions or data requests, please contact orders@sahanvi.com. Effective Date: 1 January 2022.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
