"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("sahanvi-wishlist") || "[]"));
  }, []);

  function clearWishlist() {
    localStorage.setItem("sahanvi-wishlist", "[]");
    setWishlist([]);
  }

  return (
    <div className="next-page">
      <Header />
      <main className="listing-page wishlist-page">
        <section className="search-hero">
          <p className="listing-kicker">Saved Drapes</p>
          <h1>My Wishlist</h1>
          <p>Keep your favourite sarees here while you decide.</p>
          {wishlist.length ? <button className="text-action" type="button" onClick={clearWishlist}>Clear Wishlist</button> : null}
        </section>

        <section className="listing-section">
          {!wishlist.length ? (
            <div className="empty-cart">
              <h2>No wishlist items yet</h2>
              <p>Save sarees from New Arrivals or Collections to compare later.</p>
              <a className="hero-button" href="/new-arrivals">Shop New Arrivals</a>
            </div>
          ) : (
            <div className="product-grid">
              {wishlist.map((item) => (
                <ProductCard key={item.code || item.name} name={item.name} code={item.code} price={item.price} image={item.image} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
