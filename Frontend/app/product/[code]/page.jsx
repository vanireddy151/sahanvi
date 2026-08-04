"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetail from "../../components/ProductDetail";
import { apiUrl } from "../../lib/api";

function toProduct(saree) {
  return {
    code: saree.code || "",
    name: saree.name || "",
    price: saree.price ? `₹${Number(saree.price).toLocaleString("en-IN")}` : "₹0",
    image: saree.imageUrl || "",
    palluImageUrl: saree.palluImageUrl || "",
    borderImageUrl: saree.borderImageUrl || "",
    bodyImageUrl: saree.bodyImageUrl || "",
    fabric: saree.fabric || "",
    occasion: saree.occasion || ""
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const code = decodeURIComponent(params.code || "");
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);

    let stored = null;
    try {
      stored = JSON.parse(sessionStorage.getItem("sahanvi-active-product") || "null");
    } catch {
      stored = null;
    }

    if (stored && stored.code === code) {
      setProduct(stored);
    }

    // The stored snapshot can be stale (captured whenever the listing card
    // was last rendered), so always refresh from the backend by code.
    fetch(apiUrl(`/api/sarees/code/${encodeURIComponent(code)}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((saree) => {
        if (saree) {
          setProduct(toProduct(saree));
        } else if (!stored) {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!stored) setNotFound(true);
      });
  }, [code]);

  return (
    <div className="next-page">
      <Header />
      <main className="product-detail-page">
        <button type="button" className="product-detail-back" onClick={() => router.back()}>
          &larr; Back
        </button>

        {product ? (
          <ProductDetail product={product} />
        ) : notFound ? (
          <p>
            We couldn&apos;t find that saree here &mdash; please go back and open it from the collection page.
          </p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
