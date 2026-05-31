export default function ProductCard({ image = "/assets/sahanvi-banner-person.jpeg", name, price = "₹21,020" }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        <button className="wishlist-button" type="button" aria-label={`Add ${name} to wishlist`}>♡</button>
        <span className="product-badge">New Arrival</span>
      </div>
      <h3>{name}</h3>
      <p className="product-price">{price}</p>
    </article>
  );
}
