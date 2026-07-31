"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetail from "../../components/ProductDetail";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const code = decodeURIComponent(params.code || "");
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = JSON.parse(sessionStorage.getItem("sahanvi-active-product") || "null");
    } catch {
      stored = null;
    }

    if (stored && stored.code === code) {
      setProduct(stored);
    } else {
      setNotFound(true);
    }
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
