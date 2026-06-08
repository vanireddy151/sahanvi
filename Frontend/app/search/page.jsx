"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, []);

  const results = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return products;
    return products.filter(([name, price]) => `${name} ${price}`.toLowerCase().includes(cleanQuery));
  }, [query]);

  return (
    <div className="next-page">
      <Header />
      <main className="listing-page search-page">
        <section className="search-hero">
          <p className="listing-kicker">Find Your Saree</p>
          <h1>Search Sahanvi</h1>
          <form className="site-search-form" onSubmit={(event) => event.preventDefault()}>
            <input
              aria-label="Search sarees"
              placeholder="Search by saree name, code, weave, or price"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          <p>{results.length} matching saree{results.length === 1 ? "" : "s"} found.</p>
        </section>

        <section className="listing-section">
          <div className="product-grid">
            {results.map(([name, price, image]) => (
              <ProductCard key={name} name={name} price={price} image={image} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
